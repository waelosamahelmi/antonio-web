import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Plus, Edit, Trash2, MapPin, Store, ShoppingBag, ShoppingCart, Building, Building2 } from 'lucide-react';
import { useAllLocations, useCreateLocation, useUpdateLocation, useDeleteLocation, Location } from '@/hooks/use-locations';

const iconOptions = [
  { value: 'MapPin', label: 'Map Pin', Icon: MapPin },
  { value: 'Store', label: 'Store', Icon: Store },
  { value: 'ShoppingBag', label: 'Shopping Bag', Icon: ShoppingBag },
  { value: 'ShoppingCart', label: 'Shopping Cart', Icon: ShoppingCart },
  { value: 'Building', label: 'Building', Icon: Building },
  { value: 'Building2', label: 'Building 2', Icon: Building2 },
];

export function LocationsAdmin() {
  const { data: locations = [], isLoading } = useAllLocations();
  const createLocation = useCreateLocation();
  const updateLocation = useUpdateLocation();
  const deleteLocation = useDeleteLocation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postal_code: '',
    icon: 'MapPin',
    logo_url: '',
    region: '',
    display_order: 0,
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      postal_code: '',
      icon: 'MapPin',
      logo_url: '',
      region: '',
      display_order: 0,
      is_active: true,
    });
    setEditingLocation(null);
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      address: location.address,
      city: location.city,
      postal_code: location.postal_code || '',
      icon: location.icon,
      logo_url: location.logo_url || '',
      region: location.region || '',
      display_order: location.display_order,
      is_active: location.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingLocation) {
        await updateLocation.mutateAsync({ id: editingLocation.id, ...formData });
      } else {
        await createLocation.mutateAsync(formData as any);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save location:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this location?')) {
      try {
        await deleteLocation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete location:', error);
      }
    }
  };

  const getIcon = (iconName: string) => {
    const option = iconOptions.find(opt => opt.value === iconName);
    return option?.Icon || MapPin;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Ruokapisteet Management</CardTitle>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Location
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : locations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No locations found. Add your first location!</div>
        ) : (
          <div className="space-y-4">
            {locations.map((location) => {
              const IconComponent = getIcon(location.icon);
              return (
                <Card key={location.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        location.is_active ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{location.name}</h3>
                          {!location.is_active && (
                            <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">Inactive</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{location.address}, {location.postal_code} {location.city}</span>
                          </div>
                          {location.region && (
                            <div className="text-xs text-gray-500">Region: {location.region}</div>
                          )}
                          <div className="text-xs text-gray-500">Display Order: {location.display_order}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(location)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(location.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingLocation ? 'Edit Location' : 'Add New Location'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Location Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="K-Citymarket Karisma"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Kauppiaankatu 2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Lahti"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    placeholder="15160"
                  />
                </div>

                <div>
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="Lahti"
                  />
                </div>

                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                    <SelectTrigger id="icon">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map(({ value, label, Icon }) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="logo_url">Logo URL (optional)</Label>
                  <Input
                    id="logo_url"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    placeholder="https://example.com/logo.png"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional store logo image URL</p>
                </div>

                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingLocation ? 'Update' : 'Create'} Location
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
