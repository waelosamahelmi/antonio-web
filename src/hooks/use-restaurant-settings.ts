import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DatabaseRestaurantSettings, convertDatabaseHoursToWeekSchedule } from '../config/restaurant-config';
import { useRestaurantConfig } from './use-restaurant-config';

// Global state manager for restaurant settings
class RestaurantSettingsManager {
  private static instance: RestaurantSettingsManager;
  private subscribers: Set<(settings: DatabaseRestaurantSettings | null) => void> = new Set();
  private subscription: any = null;
  private currentSettings: DatabaseRestaurantSettings | null = null;
  private isInitialized = false;

  static getInstance(): RestaurantSettingsManager {
    if (!RestaurantSettingsManager.instance) {
      RestaurantSettingsManager.instance = new RestaurantSettingsManager();
    }
    return RestaurantSettingsManager.instance;
  }

  subscribe(callback: (settings: DatabaseRestaurantSettings | null) => void) {
    this.subscribers.add(callback);
    
    // Initialize subscription if this is the first subscriber
    if (this.subscribers.size === 1 && !this.subscription) {
      this.initializeSubscription();
    }
    
    // Send current settings immediately if available
    if (this.isInitialized) {
      callback(this.currentSettings);
    }

    return () => {
      this.subscribers.delete(callback);
      // Clean up subscription if no more subscribers
      if (this.subscribers.size === 0 && this.subscription) {
        this.subscription.unsubscribe();
        this.subscription = null;
      }
    };
  }

  private async initializeSubscription() {
    try {
      console.log('🔄 Fetching fresh restaurant settings from database...');
      
      // Fetch initial data with cache disabled
      const { data, error } = await supabase
        .from('restaurant_settings')
        .select('*')
        .single();

      if (!error && data) {
        console.log('✅ Restaurant settings loaded:', {
          opening_hours: data.opening_hours,
          pickup_hours: data.pickup_hours,
          delivery_hours: data.delivery_hours,
          is_busy: data.is_busy,
          is_open: data.is_open
        });
        this.currentSettings = data;
      } else {
        console.warn('⚠️ Failed to load database settings:', error);
      }
      
      this.isInitialized = true;
      this.notifySubscribers();

      // Set up real-time subscription
      this.subscription = supabase
        .channel(`restaurant_settings_${Date.now()}`) // Unique channel name
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'restaurant_settings',
          },
          (payload) => {
            console.log('🔔 Restaurant settings changed:', payload);
            if (payload.new && typeof payload.new === 'object') {
              this.currentSettings = payload.new as DatabaseRestaurantSettings;
              this.notifySubscribers();
            }
          }
        )
        .subscribe();
    } catch (error) {
      console.error('❌ Error initializing restaurant settings subscription:', error);
      this.isInitialized = true;
      this.notifySubscribers();
    }
  }

  // Add force refresh method
  async forceRefresh() {
    console.log('🔄 Force refreshing restaurant settings...');
    try {
      const { data, error } = await supabase
        .from('restaurant_settings')
        .select('*')
        .single();

      if (!error && data) {
        console.log('✅ Force refresh successful:', data.opening_hours);
        this.currentSettings = data;
        this.notifySubscribers();
      } else {
        console.error('❌ Force refresh failed:', error);
      }
    } catch (error) {
      console.error('❌ Error during force refresh:', error);
    }
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.currentSettings));
  }
}

export function useRestaurantSettings() {
  const { config: baseConfig, loading: configLoading } = useRestaurantConfig();
  const [dbSettings, setDbSettings] = useState<DatabaseRestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const manager = RestaurantSettingsManager.getInstance();
    
    const unsubscribe = manager.subscribe((settings) => {
      console.log('📡 Received restaurant settings update:', {
        opening_hours: settings?.opening_hours,
        pickup_hours: settings?.pickup_hours,
        delivery_hours: settings?.delivery_hours
      });
      setDbSettings(settings);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Force refresh function
  const refresh = async () => {
    const manager = RestaurantSettingsManager.getInstance();
    await manager.forceRefresh();
  };

  // Create a config with merged hours from database
  const config = baseConfig ? {
    ...baseConfig,
    hours: dbSettings ? {
      general: convertDatabaseHoursToWeekSchedule(dbSettings.opening_hours),
      pickup: convertDatabaseHoursToWeekSchedule(dbSettings.pickup_hours),
      delivery: convertDatabaseHoursToWeekSchedule(dbSettings.delivery_hours),
    } : baseConfig.hours,
    services: {
      ...baseConfig.services,
      lunchBuffetHours: dbSettings?.lunch_buffet_hours 
        ? convertDatabaseHoursToWeekSchedule(dbSettings.lunch_buffet_hours)
        : baseConfig.services.lunchBuffetHours,
    },
    // Merge busy status from database settings
    isBusy: dbSettings?.is_busy || false,
    // Merge theme: use database theme from baseConfig (which comes from useRestaurantConfig)
    // The baseConfig already contains the database theme if available
    theme: baseConfig.theme
  } : null;

  // Debug logging
  if (config && dbSettings) {
    console.log('🏪 Restaurant Config Ready:', {
      generalHours: config.hours.general,
      pickupHours: config.hours.pickup,
      deliveryHours: config.hours.delivery,
      isBusy: config.isBusy,
      dbIsBusy: dbSettings.is_busy,
      isOpen: dbSettings.is_open
    });
  }

  return {
    config,
    dbSettings,
    loading: loading || configLoading,
    error,
    isOpen: dbSettings?.is_open ?? true,
    specialMessage: dbSettings?.special_message,
    refresh, // Export refresh function
  };
}
