import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { useRestaurant } from "@/lib/restaurant-context";
import { useQuery } from "@tanstack/react-query";
import { sendMarketingEmail } from "@/lib/email-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Send, Users, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// HTML Email Templates
const emailTemplates = {
  promotional: {
    name: "Promotional Offer",
    subject: "Special Offer Just for You!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
          .button { display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>{{TITLE}}</h1>
          </div>
          <div class="content">
            {{CONTENT}}
            <a href="{{LINK}}" class="button">Order Now</a>
          </div>
          <div class="footer">
            <p>{{RESTAURANT_NAME}}</p>
            <p>{{RESTAURANT_ADDRESS}}</p>
            <p>{{RESTAURANT_PHONE}}</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  newsletter: {
    name: "Newsletter",
    subject: "What's New at Our Restaurant",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f9fafb; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 40px 30px; text-align: center; }
          .content { background: white; padding: 30px; }
          .section { margin-bottom: 30px; padding-bottom: 30px; border-bottom: 1px solid #e5e7eb; }
          .section:last-child { border-bottom: none; }
          .button { display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; }
          .footer { background: #1f2937; color: white; padding: 30px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>{{TITLE}}</h1>
            <p>{{SUBTITLE}}</p>
          </div>
          <div class="content">
            {{CONTENT}}
          </div>
          <div class="footer">
            <p>{{RESTAURANT_NAME}}</p>
            <p>{{RESTAURANT_ADDRESS}} | {{RESTAURANT_PHONE}}</p>
            <p style="margin-top: 20px; color: #9ca3af;">You're receiving this because you're a valued customer</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  announcement: {
    name: "Announcement",
    subject: "Important Update from Us",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; background: white; border: 2px solid #dc2626; border-radius: 10px; overflow: hidden; }
          .header { background: #dc2626; color: white; padding: 30px; text-align: center; }
          .content { padding: 40px 30px; }
          .highlight { background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📢 {{TITLE}}</h1>
          </div>
          <div class="content">
            <div class="highlight">
              {{CONTENT}}
            </div>
            <p style="color: #6b7280; margin-top: 30px;">Thank you for your attention!</p>
          </div>
          <div class="footer">
            <p>{{RESTAURANT_NAME}} | {{RESTAURANT_PHONE}}</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
};

export function EmailMarketing() {
  const { t } = useLanguage();
  const { config } = useRestaurant();
  const { toast } = useToast();
  
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof emailTemplates>("promotional");
  const [emailSubject, setEmailSubject] = useState(emailTemplates.promotional.subject);
  const [emailTitle, setEmailTitle] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [emailLink, setEmailLink] = useState("");
  const [selectAll, setSelectAll] = useState(true);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Fetch customers
  const { data: customers } = useQuery({
    queryKey: ['/api/customers'],
    queryFn: async () => {
      // This would fetch from your customer database
      return [];
    }
  });

  const handleTemplateChange = (template: keyof typeof emailTemplates) => {
    setSelectedTemplate(template);
    setEmailSubject(emailTemplates[template].subject);
  };

  const handleSendEmail = async () => {
    if (!emailTitle || !emailContent) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and content",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    setEmailSent(false);

    try {
      const template = emailTemplates[selectedTemplate];
      let html = template.html;
      
      // Replace placeholders
      html = html.replace('{{TITLE}}', emailTitle);
      html = html.replace('{{SUBTITLE}}', emailSubject);
      html = html.replace('{{CONTENT}}', emailContent.replace(/\n/g, '<br>'));
      html = html.replace('{{LINK}}', emailLink || '#');
      html = html.replace(/{{RESTAURANT_NAME}}/g, config.name);
      html = html.replace(/{{RESTAURANT_ADDRESS}}/g, `${config.address.street}, ${config.address.city}`);
      html = html.replace(/{{RESTAURANT_PHONE}}/g, config.phone);

      // Get recipient emails
      let recipients: string[] = [];
      if (selectAll) {
        recipients = customers?.map((c: any) => c.email) || [];
      } else {
        recipients = customers
          ?.filter((c: any) => selectedCustomers.includes(c.id))
          .map((c: any) => c.email) || [];
      }

      // If no customers in database, use a placeholder for testing
      if (recipients.length === 0) {
        console.log('No customer emails found - would send to all registered customers');
        recipients = ['test@example.com']; // Replace with actual customer query
      }

      const result = await sendMarketingEmail({
        recipients,
        subject: emailSubject,
        htmlContent: html
      });

      if (result.success) {
        toast({
          title: "Emails Sent Successfully",
          description: `Marketing emails have been sent to ${recipients.length} customer(s)`,
        });
        
        setEmailSent(true);
        
        // Reset form
        setTimeout(() => {
          setEmailTitle("");
          setEmailContent("");
          setEmailLink("");
          setEmailSent(false);
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to send emails');
      }
    } catch (error) {
      toast({
        title: "Failed to Send Emails",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            {t("Sähköpostimarkkinointi", "Email Marketing")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Selection */}
          <div className="space-y-2">
            <Label>{t("Valitse pohja", "Select Template")}</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(emailTemplates).map(([key, template]) => (
                  <SelectItem key={key} value={key}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Email Subject */}
          <div className="space-y-2">
            <Label>{t("Aihe", "Subject")}</Label>
            <Input
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Enter email subject"
            />
          </div>

          {/* Email Title */}
          <div className="space-y-2">
            <Label>{t("Otsikko", "Title")}</Label>
            <Input
              value={emailTitle}
              onChange={(e) => setEmailTitle(e.target.value)}
              placeholder="Enter main title"
            />
          </div>

          {/* Email Content */}
          <div className="space-y-2">
            <Label>{t("Sisältö", "Content")}</Label>
            <Textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Enter email content..."
              rows={8}
            />
          </div>

          {/* Link (for promotional template) */}
          {selectedTemplate === 'promotional' && (
            <div className="space-y-2">
              <Label>{t("Linkki", "Link URL")}</Label>
              <Input
                value={emailLink}
                onChange={(e) => setEmailLink(e.target.value)}
                placeholder="https://yourwebsite.com/offer"
              />
            </div>
          )}

          {/* Customer Selection */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t("Vastaanottajat", "Recipients")}
            </Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectAll}
                onCheckedChange={(checked) => setSelectAll(!!checked)}
              />
              <label
                htmlFor="select-all"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Valitse kaikki asiakkaat", "Select all customers")}
              </label>
            </div>

            {!selectAll && (
              <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                {customers && customers.length > 0 ? (
                  customers.map((customer: any) => (
                    <div key={customer.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`customer-${customer.id}`}
                        checked={selectedCustomers.includes(customer.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCustomers([...selectedCustomers, customer.id]);
                          } else {
                            setSelectedCustomers(selectedCustomers.filter(id => id !== customer.id));
                          }
                        }}
                      />
                      <label
                        htmlFor={`customer-${customer.id}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {customer.email} - {customer.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">{t("Ei asiakkaita", "No customers found")}</p>
                )}
              </div>
            )}
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendEmail}
            disabled={isSending || !emailTitle || !emailContent}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("Lähetetään...", "Sending...")}
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {t("Lähetä sähköpostit", "Send Emails")}
              </>
            )}
          </Button>

          {/* Success Message */}
          {emailSent && (
            <div className="flex items-center gap-2 p-4 bg-green-50 text-green-800 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span>{t("Sähköpostit lähetetty onnistuneesti!", "Emails sent successfully!")}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("Esikatselu", "Preview")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-600 mb-4">
              {t("Tämä on likimääräinen esikatselu. Todellinen sähköposti voi näyttää hieman erilaiselta.", 
                 "This is an approximate preview. The actual email may look slightly different.")}
            </p>
            <div className="bg-white rounded border">
              <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 text-center">
                <h2 className="text-2xl font-bold">{emailTitle || "Email Title"}</h2>
              </div>
              <div className="p-6">
                <div className="whitespace-pre-wrap">{emailContent || "Email content will appear here..."}</div>
                {selectedTemplate === 'promotional' && emailLink && (
                  <button className="mt-4 bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-2 rounded">
                    Order Now
                  </button>
                )}
              </div>
              <div className="bg-gray-100 p-4 text-center text-sm text-gray-600">
                {config.name} | {config.address.city}, {config.address.country}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
