import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { useItem, useUpdateItem, useItemHistory, useBuyerByItem, useBuyerInvoices, useBuyerPaymentOrders } from "@/hooks/use-items";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BuyerCard } from "@/components/buyers/BuyerCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Save, 
  FileText, 
  Image, 
  Truck, 
  DollarSign, 
  Users, 
  List, 
  History,
  CheckCircle,
  XCircle,
  Loader2,
  Upload,
  ExternalLink,
  Mail,
  Phone,
  Building2,
  Calendar,
  Globe,
  Ban,
  AlertCircle,
  Clock,
  MapPin,
  Receipt,
  ChevronDown,
  ChevronUp,
  CreditCard,
  ShoppingCart,
  StickyNote
} from "lucide-react";
import { ItemProgressStepper } from "@/components/ItemProgressStepper";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import type { Item, HistoryEvent, BuyerInvoice, PaymentOrder } from "@shared/schema";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function ItemDetails() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data: item, isLoading, error } = useItem(id);
  const { data: historyEvents, isLoading: historyLoading } = useItemHistory(id);
  const { data: buyer, isLoading: buyerLoading } = useBuyerByItem(id);
  const { data: invoices, isLoading: invoicesLoading } = useBuyerInvoices(buyer?.id);
  const { data: paymentOrders, isLoading: paymentOrdersLoading } = useBuyerPaymentOrders(buyer?.id);
  const updateMutation = useUpdateItem(id);
  
  const [invoicesOpen, setInvoicesOpen] = useState(false);
  const [paymentOrdersOpen, setPaymentOrdersOpen] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<Item>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item]);

  const handleChange = (field: keyof Item, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      const { id, createdAt, updatedAt, ...updatePayload } = formData as any;
      await updateMutation.mutateAsync(updatePayload);
      setHasChanges(false);
      toast({
        title: "Changes saved",
        description: "Item details have been updated successfully.",
      });
    } catch (err) {
      toast({
        title: "Error saving changes",
        description: err instanceof Error ? err.message : "Failed to save changes",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (error || !item) {
    return (
      <AppLayout>
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="text-center py-12 sm:py-20">
            <XCircle className="w-12 sm:w-16 h-12 sm:h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Item not found</h2>
            <p className="text-muted-foreground mb-4">The item you're looking for doesn't exist.</p>
            <Link href="/items">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Items
              </Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const badgeVariant = 
    item.status === 'Paid' ? 'badge-paid' :
    item.status === 'Reserved' ? 'badge-reserved' :
    item.status === 'Created' ? 'badge-created' : 
    'bg-gray-100 text-gray-700';

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            <Link href="/items">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 flex-wrap">
                <Link href="/" className="hover:text-foreground">Home</Link>
                <span>/</span>
                <Link href="/items" className="hover:text-foreground">Items</Link>
                <span>/</span>
                <span className="text-foreground font-medium">{item.displayId}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold truncate" data-testid="text-item-title">{item.title}</h1>
                <Badge variant="outline" className={`${badgeVariant} border-0`}>
                  {item.status}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="hidden sm:block">
              <ItemProgressStepper 
                status={item.status || "Created"} 
                collectionStatus={item.collectionStatus}
                publishingStatus={item.publishingStatus}
              />
            </div>
            {item.buyerId && (
              <Badge variant="secondary" className="h-8 sm:h-9 px-3 sm:px-4 gap-2 border-primary/20 bg-primary/5 text-primary text-xs sm:text-sm">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Linked to Buyer</span> {item.buyerName}
              </Badge>
            )}
            <Button 
              onClick={handleSave} 
              disabled={!hasChanges || updateMutation.isPending}
              size="sm"
              className="sm:h-9"
              data-testid="button-save"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save
            </Button>
          </div>
        </div>

        <Tabs defaultValue="details" className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <TabsList className="bg-muted/50 p-1 h-auto gap-1 w-max sm:w-auto sm:flex-wrap">
            <TabsTrigger value="details" className="gap-2" data-testid="tab-details">
              <FileText className="w-4 h-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="media" className="gap-2" data-testid="tab-media">
              <Image className="w-4 h-4" />
              Media & Specs
            </TabsTrigger>
            <TabsTrigger value="logistics" className="gap-2" data-testid="tab-logistics">
              <Truck className="w-4 h-4" />
              Logistics
            </TabsTrigger>
            <TabsTrigger value="commercials" className="gap-2" data-testid="tab-commercials">
              <DollarSign className="w-4 h-4" />
              Commercials
            </TabsTrigger>
            <TabsTrigger value="seller" className="gap-2" data-testid="tab-seller">
              <Users className="w-4 h-4" />
              Seller
            </TabsTrigger>
            <TabsTrigger value="listings" className="gap-2" data-testid="tab-listings">
              <List className="w-4 h-4" />
              Listings
            </TabsTrigger>
            <TabsTrigger value="buyer" className="gap-2" data-testid="tab-buyer">
              <Users className="w-4 h-4" />
              Buyer
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2" data-testid="tab-history">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
          </TabsList>
          </div>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Core Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FieldGroup label="Item ID" readOnly>
                      <Input value={formData.displayId || ""} disabled data-testid="input-item-id" />
                    </FieldGroup>
                    <FieldGroup label="Lot Number" readOnly>
                      <Input value={formData.lotNumber || ""} disabled data-testid="input-lot-number" />
                    </FieldGroup>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FieldGroup label="External Reference" editable>
                      <Input 
                        value={formData.externalReference || ""} 
                        onChange={(e) => handleChange("externalReference", e.target.value)}
                        placeholder="Your reference"
                        data-testid="input-external-ref"
                      />
                    </FieldGroup>
                    <FieldGroup label="Product Name" editable>
                      <Input 
                        value={formData.productName || ""} 
                        onChange={(e) => handleChange("productName", e.target.value)}
                        data-testid="input-product-name"
                      />
                    </FieldGroup>
                  </div>
                  <FieldGroup label="Lot Title" editable>
                    <Input 
                      value={formData.lotTitle || ""} 
                      onChange={(e) => handleChange("lotTitle", e.target.value)}
                      data-testid="input-lot-title"
                    />
                  </FieldGroup>
                  <FieldGroup label="Item Description" editable>
                    <Textarea 
                      value={formData.itemDescription || ""} 
                      onChange={(e) => handleChange("itemDescription", e.target.value)}
                      rows={4}
                      data-testid="input-item-description"
                    />
                  </FieldGroup>
                  <FieldGroup label="Additional Information" editable>
                    <Textarea 
                      value={formData.additionalInformation || ""} 
                      onChange={(e) => handleChange("additionalInformation", e.target.value)}
                      placeholder="Provide additional information about this item..."
                      rows={3}
                      data-testid="input-additional-info"
                    />
                  </FieldGroup>
                  <FieldGroup label="Remarks (Internal)" editable>
                    <Textarea 
                      value={formData.remarks || ""} 
                      onChange={(e) => handleChange("remarks", e.target.value)}
                      placeholder="Type your remark here..."
                      rows={3}
                      data-testid="input-remarks"
                    />
                  </FieldGroup>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Classification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FieldGroup label="Category" editable>
                      <Input 
                        value={formData.category || ""} 
                        onChange={(e) => handleChange("category", e.target.value)}
                        data-testid="input-category"
                      />
                    </FieldGroup>
                    <FieldGroup label="Subcategory" editable>
                      <Input 
                        value={formData.subcategory || ""} 
                        onChange={(e) => handleChange("subcategory", e.target.value)}
                        data-testid="input-subcategory"
                      />
                    </FieldGroup>
                    {formData.favouriteCategories && formData.favouriteCategories.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Favourite Categories</Label>
                        <div className="flex flex-wrap gap-2">
                          {formData.favouriteCategories.map((cat, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Language</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FieldGroup label="Source Language" readOnly>
                      <Input value={formData.sourceLanguage || "en"} disabled data-testid="input-source-language" />
                    </FieldGroup>
                    <div className="flex items-center justify-between">
                      <Label>Translated</Label>
                      <Badge variant={formData.translated ? "default" : "secondary"}>
                        {formData.translated ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Validation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Error Count</Label>
                      <Badge variant={formData.errorCount ? "destructive" : "secondary"}>
                        {formData.errorCount || 0}
                      </Badge>
                    </div>
                    {formData.validationFailures && formData.validationFailures.length > 0 && (
                      <div className="text-sm text-destructive space-y-1">
                        {formData.validationFailures.map((failure, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <XCircle className="w-3 h-3" />
                            {failure}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">System</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FieldGroup label="Item Source" readOnly>
                      <Input value={formData.itemSource || "-"} disabled data-testid="input-item-source" />
                    </FieldGroup>
                    <FieldGroup label="Platform" readOnly>
                      <Input value={formData.platform || "-"} disabled data-testid="input-platform" />
                    </FieldGroup>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Image Gallery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {formData.imageGallery && formData.imageGallery.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.imageGallery.map((url, idx) => (
                          <div key={idx} className="relative aspect-square rounded-md overflow-hidden bg-muted group">
                            <img 
                              src={url} 
                              alt={`Image ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                              {formData.uploadName || "IMG"}-{idx + 1}.jpg
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-border rounded-md p-8 text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Drag files here to upload</p>
                        <Button variant="outline" size="sm" className="mt-3">
                          Browse files
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Specifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <FieldGroup label="Brand" editable>
                        <Input 
                          value={formData.brand || ""} 
                          onChange={(e) => handleChange("brand", e.target.value)}
                          data-testid="input-brand"
                        />
                      </FieldGroup>
                      <FieldGroup label="Model" editable>
                        <Input 
                          value={formData.model || ""} 
                          onChange={(e) => handleChange("model", e.target.value)}
                          data-testid="input-model"
                        />
                      </FieldGroup>
                      <FieldGroup label="Product Type" editable>
                        <Input 
                          value={formData.productType || ""} 
                          onChange={(e) => handleChange("productType", e.target.value)}
                          data-testid="input-product-type"
                        />
                      </FieldGroup>
                      <FieldGroup label="Colour" editable>
                        <Input 
                          value={formData.colour || ""} 
                          onChange={(e) => handleChange("colour", e.target.value)}
                          data-testid="input-colour"
                        />
                      </FieldGroup>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <FieldGroup label="Weight (kg)" editable>
                        <Input 
                          type="number"
                          value={formData.weight || ""} 
                          onChange={(e) => handleChange("weight", parseFloat(e.target.value))}
                          data-testid="input-weight"
                        />
                      </FieldGroup>
                      <FieldGroup label="Length (cm)" editable>
                        <Input 
                          type="number"
                          value={formData.length || ""} 
                          onChange={(e) => handleChange("length", parseFloat(e.target.value))}
                          data-testid="input-length"
                        />
                      </FieldGroup>
                      <FieldGroup label="Width (cm)" editable>
                        <Input 
                          type="number"
                          value={formData.width || ""} 
                          onChange={(e) => handleChange("width", parseFloat(e.target.value))}
                          data-testid="input-width"
                        />
                      </FieldGroup>
                      <FieldGroup label="Height (cm)" editable>
                        <Input 
                          type="number"
                          value={formData.height || ""} 
                          onChange={(e) => handleChange("height", parseFloat(e.target.value))}
                          data-testid="input-height"
                        />
                      </FieldGroup>
                      <FieldGroup label="Quantity" editable>
                        <Input 
                          type="number"
                          value={formData.quantity || 1} 
                          onChange={(e) => handleChange("quantity", parseInt(e.target.value))}
                          data-testid="input-quantity"
                        />
                      </FieldGroup>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <FieldGroup label="Seat Height (cm)" editable>
                        <Input 
                          type="number"
                          value={formData.seatHeight || ""} 
                          onChange={(e) => handleChange("seatHeight", parseFloat(e.target.value))}
                          data-testid="input-seat-height"
                        />
                      </FieldGroup>
                      <FieldGroup label="Depth (cm)" editable>
                        <Input 
                          type="number"
                          value={formData.depth || ""} 
                          onChange={(e) => handleChange("depth", parseFloat(e.target.value))}
                          data-testid="input-depth"
                        />
                      </FieldGroup>
                      <FieldGroup label="Material" editable>
                        <Input 
                          value={formData.material || ""} 
                          onChange={(e) => handleChange("material", e.target.value)}
                          data-testid="input-material"
                        />
                      </FieldGroup>
                      <FieldGroup label="HS Code" editable>
                        <Input 
                          value={formData.hsCode || ""} 
                          onChange={(e) => handleChange("hsCode", e.target.value)}
                          placeholder="Enter hs code"
                          data-testid="input-hs-code"
                        />
                      </FieldGroup>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Media Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Media Uploaded</Label>
                      <Badge variant={formData.mediaUploaded ? "default" : "secondary"}>
                        {formData.mediaUploaded ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <FieldGroup label="Upload Name" readOnly>
                      <Input value={formData.uploadName || "-"} disabled data-testid="input-upload-name" />
                    </FieldGroup>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">3D Tour</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FieldGroup label="3D Tour Link" editable>
                      <Input 
                        value={formData.tour3dUrl || ""} 
                        onChange={(e) => handleChange("tour3dUrl", e.target.value)}
                        placeholder="https://..."
                        data-testid="input-3d-tour"
                      />
                    </FieldGroup>
                    {formData.tour3dUrl && (
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={formData.tour3dUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open 3D Tour
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Proof of Ownership</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {formData.ownershipProofUrl ? (
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={formData.ownershipProofUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Document
                        </a>
                      </Button>
                    ) : (
                      <p className="text-sm text-muted-foreground">There are no ownership proofs uploaded for this item</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logistics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Location & Collection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FieldGroup label="Location" editable>
                    <Input 
                      value={formData.location || ""} 
                      onChange={(e) => handleChange("location", e.target.value)}
                      data-testid="input-location"
                    />
                  </FieldGroup>
                  <FieldGroup label="Collection Window" editable>
                    <Input 
                      value={formData.collectionWindow || ""} 
                      onChange={(e) => handleChange("collectionWindow", e.target.value)}
                      placeholder="e.g., Mon-Fri 09:00-17:00"
                      data-testid="input-collection-window"
                    />
                  </FieldGroup>
                  <FieldGroup label="Collection Contact Information" editable>
                    <Textarea 
                      value={formData.collectionContactInfo || ""} 
                      onChange={(e) => handleChange("collectionContactInfo", e.target.value)}
                      rows={2}
                      data-testid="input-collection-contact"
                    />
                  </FieldGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Delivery</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FieldGroup label="Delivery Terms" editable>
                    <Textarea 
                      value={formData.deliveryTerms || ""} 
                      onChange={(e) => handleChange("deliveryTerms", e.target.value)}
                      rows={3}
                      data-testid="input-delivery-terms"
                    />
                  </FieldGroup>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FieldGroup label="Allocation" editable>
                    <Input 
                      value={formData.allocation || ""} 
                      onChange={(e) => handleChange("allocation", e.target.value)}
                      placeholder="e.g., Pallet A-12"
                      data-testid="input-allocation"
                    />
                  </FieldGroup>
                  <FieldGroup label="Day Partition" editable>
                    <Input 
                      value={formData.dayPartition || ""} 
                      onChange={(e) => handleChange("dayPartition", e.target.value)}
                      placeholder="e.g., Morning, Afternoon"
                      data-testid="input-day-partition"
                    />
                  </FieldGroup>
                  <FieldGroup label="Special Handling Notes" editable>
                    <Textarea 
                      value={formData.specialHandlingNotes || ""} 
                      onChange={(e) => handleChange("specialHandlingNotes", e.target.value)}
                      rows={2}
                      data-testid="input-handling-notes"
                    />
                  </FieldGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commercials" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FieldGroup label="Starting Price" editable>
                      <div className="flex gap-2">
                        <span className="flex items-center px-3 bg-muted rounded-l-md border border-r-0 text-sm">
                          {formData.currency || "EUR"}
                        </span>
                        <Input 
                          type="number"
                          value={formData.startingPrice || ""} 
                          onChange={(e) => handleChange("startingPrice", parseFloat(e.target.value))}
                          className="rounded-l-none"
                          data-testid="input-starting-price"
                        />
                      </div>
                    </FieldGroup>
                    <FieldGroup label="Estimated Price" editable>
                      <div className="flex gap-2">
                        <span className="flex items-center px-3 bg-muted rounded-l-md border border-r-0 text-sm">
                          {formData.currency || "EUR"}
                        </span>
                        <Input 
                          type="number"
                          value={formData.estimatedPrice || ""} 
                          onChange={(e) => handleChange("estimatedPrice", parseFloat(e.target.value))}
                          className="rounded-l-none"
                          data-testid="input-estimated-price"
                        />
                      </div>
                    </FieldGroup>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FieldGroup label="Retail Price" editable>
                      <Input 
                        type="number"
                        value={formData.retailPrice || ""} 
                        onChange={(e) => handleChange("retailPrice", parseFloat(e.target.value))}
                        data-testid="input-retail-price"
                      />
                    </FieldGroup>
                    <FieldGroup label="Sale Type" editable>
                      <Input 
                        value={formData.saleType || ""} 
                        onChange={(e) => handleChange("saleType", e.target.value)}
                        placeholder="e.g., No reserve price"
                        data-testid="input-sale-type"
                      />
                    </FieldGroup>
                  </div>
                  {formData.saleType === "No reserve price" && (
                    <p className="text-xs text-muted-foreground">
                      This means there is no minimum bid amount required, the lot will be awarded to the highest bidder.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tax & Margin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FieldGroup label="VAT Rate" editable>
                      <div className="flex gap-2">
                        <span className="flex items-center px-3 bg-muted rounded-l-md border border-r-0 text-sm">%</span>
                        <Input 
                          type="number"
                          value={formData.vatRate || ""} 
                          onChange={(e) => handleChange("vatRate", parseFloat(e.target.value))}
                          className="rounded-l-none"
                          data-testid="input-vat-rate"
                        />
                      </div>
                    </FieldGroup>
                    <FieldGroup label="Currency" editable>
                      <Input 
                        value={formData.currency || "EUR"} 
                        onChange={(e) => handleChange("currency", e.target.value)}
                        data-testid="input-currency"
                      />
                    </FieldGroup>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Margin Good</Label>
                    <Badge variant={formData.marginGood ? "default" : "secondary"}>
                      {formData.marginGood ? (
                        <><CheckCircle className="w-3 h-3 mr-1" /> Yes</>
                      ) : (
                        <><XCircle className="w-3 h-3 mr-1" /> No</>
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Bid Deposit Required</Label>
                    <Badge variant={formData.bidDepositRequired ? "default" : "secondary"}>
                      {formData.bidDepositRequired ? "Yes" : "No"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldGroup label="Additional Costs Label" editable>
                    <Input 
                      value={formData.additionalCostsLabel || ""} 
                      onChange={(e) => handleChange("additionalCostsLabel", e.target.value)}
                      placeholder="Describe additional costs..."
                      data-testid="input-costs-label"
                    />
                  </FieldGroup>
                  <FieldGroup label="Additional Costs" editable>
                    <div className="flex gap-2">
                      <span className="flex items-center px-3 bg-muted rounded-l-md border border-r-0 text-sm">
                        {formData.currency || "EUR"}
                      </span>
                      <Input 
                        type="number"
                        value={formData.additionalCosts || ""} 
                        onChange={(e) => handleChange("additionalCosts", parseFloat(e.target.value))}
                        className="rounded-l-none"
                        data-testid="input-additional-costs"
                      />
                    </div>
                  </FieldGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seller" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Seller Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FieldGroup label="Seller Name" readOnly>
                    <Input value={formData.sellerName || "-"} disabled data-testid="input-seller-name" />
                  </FieldGroup>
                  <FieldGroup label="Seller ID" readOnly>
                    <Input value={formData.sellerId || "-"} disabled data-testid="input-seller-id" />
                  </FieldGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Billing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FieldGroup label="Billing Entity" readOnly>
                    <Input value={formData.billingEntity || "-"} disabled data-testid="input-billing-entity" />
                  </FieldGroup>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Agreement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldGroup label="Agreement ID" readOnly>
                    <Input value={formData.agreementId || "-"} disabled data-testid="input-agreement-id" />
                  </FieldGroup>
                  <FieldGroup label="Agreement Name" readOnly>
                    <Input value={formData.agreementName || "-"} disabled data-testid="input-agreement-name" />
                  </FieldGroup>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldGroup label="Storefront" editable>
                    <Input 
                      value={formData.storefront || ""} 
                      onChange={(e) => handleChange("storefront", e.target.value)}
                      data-testid="input-storefront"
                    />
                  </FieldGroup>
                  <FieldGroup label="Site Manager" editable>
                    <Input 
                      value={formData.siteManager || ""} 
                      onChange={(e) => handleChange("siteManager", e.target.value)}
                      data-testid="input-site-manager"
                    />
                  </FieldGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Listing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FieldGroup label="Auction Name" readOnly>
                    <Input value={formData.auctionName || formData.auctionTitle || "-"} disabled data-testid="input-auction-name" />
                  </FieldGroup>
                  <FieldGroup label="Lot ID / Number" readOnly>
                    <Input value={formData.lotIdNumber || formData.lotDisplayId || "-"} disabled data-testid="input-lot-id" />
                  </FieldGroup>
                  <FieldGroup label="Listing Status" readOnly>
                    <Input value={formData.listingStatus || formData.status || "-"} disabled data-testid="input-listing-status" />
                  </FieldGroup>
                  <FieldGroup label="Closing Date" readOnly>
                    <Input 
                      value={formData.closingDate ? format(new Date(formData.closingDate), "dd MMM yyyy HH:mm") : "-"} 
                      disabled 
                      data-testid="input-closing-date" 
                    />
                  </FieldGroup>
                  <FieldGroup label="Sale Attempt" readOnly>
                    <Input value={String(formData.saleAttempt || 1)} disabled data-testid="input-sale-attempt" />
                  </FieldGroup>
                  <FieldGroup label="Publishing Status" readOnly>
                    <Input value={formData.publishingStatus || "-"} disabled data-testid="input-publishing-status" />
                  </FieldGroup>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <Label>Synced</Label>
                  <Badge variant={formData.synced ? "default" : "secondary"}>
                    {formData.synced ? (
                      <><CheckCircle className="w-3 h-3 mr-1" /> Yes</>
                    ) : (
                      <><XCircle className="w-3 h-3 mr-1" /> No</>
                    )}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="buyer" className="space-y-6">
            {buyerLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-[300px] w-full" />
                <Skeleton className="h-[300px] w-full" />
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[200px] w-full" />
              </div>
            ) : buyer ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Buyer Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold font-mono text-primary" data-testid="text-buyer-id">{buyer.buyerId}</h3>
                          <p className="text-lg font-semibold" data-testid="text-buyer-name">{buyer.name}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge 
                            variant="outline" 
                            className={
                              buyer.riskAssessment === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800' :
                              buyer.riskAssessment === 'Under review' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800' :
                              buyer.riskAssessment === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800' :
                              'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                            }
                            data-testid="badge-risk-assessment"
                          >
                            {buyer.riskAssessment || 'Unavailable'}
                          </Badge>
                          <Badge variant="outline" className={buyer.accountType === 'Company' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800' : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800'}>
                            {buyer.accountType === 'Company' ? 'Company account' : 'Private account'}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Storefront</Label>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{buyer.storefront || "-"}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Date of Birth</Label>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {buyer.dateOfBirth ? format(new Date(buyer.dateOfBirth), "dd MMM yyyy") : "-"}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Email</Label>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{buyer.email}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Mobile</Label>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{buyer.phone || "-"}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Registration Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Company Name</Label>
                          <p className="text-sm font-medium">{buyer.companyName || "Private Individual"}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Chamber of Commerce</Label>
                          <p className="text-sm font-medium font-mono">{buyer.chamberOfCommerceNumber || "-"}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">VAT Number</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium font-mono">{buyer.vatNumber || "N/A"}</span>
                          {buyer.vatVerifiedDate && (
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified {format(new Date(buyer.vatVerifiedDate), "dd MMM yyyy HH:mm")}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Registration Address</Label>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div className="text-sm">
                            {buyer.companyName && <p className="font-medium">{buyer.companyName}</p>}
                            {buyer.addressLine1 && <p>{buyer.addressLine1}</p>}
                            {buyer.addressLine2 && <p>{buyer.addressLine2}</p>}
                            {(buyer.city || buyer.postalCode) && (
                              <p>{[buyer.city, buyer.postalCode].filter(Boolean).join(", ")}</p>
                            )}
                            {buyer.country && <p>{buyer.country}</p>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Outstanding</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${(buyer.outstandingBalance ?? 0) > 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'}`}>
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                            <p className="text-2xl font-bold" data-testid="text-outstanding-balance">
                              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(buyer.outstandingBalance ?? 0)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-muted/20 rounded-lg border">
                          <div className="flex items-center gap-2 mb-1">
                            <Receipt className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Payment Orders</span>
                          </div>
                          <p className="text-lg font-semibold">{buyer.paymentOrdersCount ?? 0}</p>
                        </div>
                        <div className="p-3 bg-muted/20 rounded-lg border">
                          <div className="flex items-center gap-2 mb-1">
                            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Lots Awaiting Checkout</span>
                          </div>
                          <p className="text-lg font-semibold">{buyer.lotsAwaitingCheckout ?? 0}</p>
                        </div>
                      </div>
                      {buyer.isBlocked && (
                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-destructive/10 border-destructive/20">
                          <Ban className="w-5 h-5 text-destructive" />
                          <div>
                            <p className="text-sm font-semibold text-destructive">Account Blocked</p>
                            <p className="text-xs text-muted-foreground">This buyer is restricted from placing new bids.</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <StickyNote className="w-4 h-4" />
                        Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="min-h-[120px] p-3 bg-muted/20 rounded-lg border">
                        <p className="text-sm whitespace-pre-wrap" data-testid="text-buyer-notes">
                          {buyer.notes || "No notes for this buyer."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment History</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Collapsible open={invoicesOpen} onOpenChange={setInvoicesOpen}>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between p-3 h-auto bg-muted/20 hover-elevate" data-testid="button-toggle-invoices">
                          <div className="flex items-center gap-2">
                            <Receipt className="w-4 h-4" />
                            <span className="font-medium">Last Invoices</span>
                            <Badge variant="secondary" className="ml-2">{invoices?.length ?? 0}</Badge>
                          </div>
                          {invoicesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        {invoicesLoading ? (
                          <div className="p-4">
                            <Skeleton className="h-20 w-full" />
                          </div>
                        ) : invoices && invoices.length > 0 ? (
                          <div className="overflow-x-auto mt-2">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left p-3 font-medium text-muted-foreground">Invoice</th>
                                  <th className="text-left p-3 font-medium text-muted-foreground">PO Number</th>
                                  <th className="text-right p-3 font-medium text-muted-foreground">Amount</th>
                                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {invoices.map((invoice: BuyerInvoice) => (
                                  <tr key={invoice.id} className="border-b hover-elevate" data-testid={`row-invoice-${invoice.id}`}>
                                    <td className="p-3 font-mono text-primary">{invoice.invoiceNumber}</td>
                                    <td className="p-3 font-mono">{invoice.poNumber || "-"}</td>
                                    <td className="p-3 text-right font-medium">
                                      {new Intl.NumberFormat('de-DE', { style: 'currency', currency: invoice.currency || 'EUR' }).format(invoice.amount)}
                                    </td>
                                    <td className="p-3">
                                      <Badge 
                                        variant="outline" 
                                        className={
                                          invoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800' :
                                          invoice.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800' :
                                          'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800'
                                        }
                                      >
                                        {invoice.status}
                                      </Badge>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="p-6 text-center text-muted-foreground">
                            No invoices found for this buyer.
                          </div>
                        )}
                      </CollapsibleContent>
                    </Collapsible>

                    <Collapsible open={paymentOrdersOpen} onOpenChange={setPaymentOrdersOpen}>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between p-3 h-auto bg-muted/20 hover-elevate" data-testid="button-toggle-payment-orders">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            <span className="font-medium">Payment Order History</span>
                            <Badge variant="secondary" className="ml-2">{paymentOrders?.length ?? 0}</Badge>
                          </div>
                          {paymentOrdersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        {paymentOrdersLoading ? (
                          <div className="p-4">
                            <Skeleton className="h-20 w-full" />
                          </div>
                        ) : paymentOrders && paymentOrders.length > 0 ? (
                          <div className="overflow-x-auto mt-2">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left p-3 font-medium text-muted-foreground">PO Number</th>
                                  <th className="text-left p-3 font-medium text-muted-foreground">Invoice</th>
                                  <th className="text-right p-3 font-medium text-muted-foreground">Amount</th>
                                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {paymentOrders.map((order: PaymentOrder) => (
                                  <tr key={order.id} className="border-b hover-elevate" data-testid={`row-payment-order-${order.id}`}>
                                    <td className="p-3 font-mono text-primary">{order.poNumber}</td>
                                    <td className="p-3 font-mono">{order.invoiceNumber || "-"}</td>
                                    <td className="p-3 text-right font-medium">
                                      {new Intl.NumberFormat('de-DE', { style: 'currency', currency: order.currency || 'EUR' }).format(order.amount)}
                                    </td>
                                    <td className="p-3">
                                      <Badge 
                                        variant="outline" 
                                        className={
                                          order.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800' :
                                          'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800'
                                        }
                                      >
                                        {order.status}
                                      </Badge>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="p-6 text-center text-muted-foreground">
                            No payment orders found for this buyer.
                          </div>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-20 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground">No buyer associated with this item yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle className="text-lg">Item History</CardTitle>
                <span className="text-sm text-muted-foreground font-normal">
                  {item.agreementReference} {item.buyerName}
                </span>
              </CardHeader>
              <CardContent>
                {historyLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : historyEvents && historyEvents.length > 0 ? (
                  <HistoryTimeline events={historyEvents} />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No history events yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Audit Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FieldGroup label="Created Date" readOnly>
                    <Input 
                      value={formData.createdAt ? format(new Date(formData.createdAt), "dd MMM yyyy HH:mm") : "-"} 
                      disabled 
                      data-testid="input-created-date" 
                    />
                  </FieldGroup>
                  <FieldGroup label="Last Updated" readOnly>
                    <Input 
                      value={formData.updatedAt ? format(new Date(formData.updatedAt), "dd MMM yyyy HH:mm") : "-"} 
                      disabled 
                      data-testid="input-updated-date" 
                    />
                  </FieldGroup>
                  <FieldGroup label="Updated By" readOnly>
                    <Input value={formData.updatedBy || "-"} disabled data-testid="input-updated-by" />
                  </FieldGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

function FieldGroup({ 
  label, 
  children, 
  readOnly, 
  editable 
}: { 
  label: string; 
  children: React.ReactNode; 
  readOnly?: boolean;
  editable?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">{label}</Label>
        {readOnly && (
          <Badge variant="outline" className="text-xs py-0 px-1.5 font-normal text-muted-foreground">
            Read-only
          </Badge>
        )}
      </div>
      {children}
    </div>
  );
}

function HistoryTimeline({ events }: { events: HistoryEvent[] }) {
  const groupedEvents: { [key: string]: HistoryEvent[] } = {};
  
  events.forEach(event => {
    const date = new Date(event.eventDate);
    let dateKey: string;
    
    if (isToday(date)) {
      dateKey = "Today";
    } else if (isYesterday(date)) {
      dateKey = "Yesterday";
    } else {
      dateKey = format(date, "MMM dd, yyyy");
    }
    
    if (!groupedEvents[dateKey]) {
      groupedEvents[dateKey] = [];
    }
    groupedEvents[dateKey].push(event);
  });

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([dateLabel, dateEvents]) => (
          <div key={dateLabel}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-medium text-muted-foreground">{dateLabel}</span>
              <Separator className="flex-1" />
            </div>
            <div className="space-y-4 pl-4">
              {dateEvents.map((event, idx) => (
                <div key={event.id} className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-primary" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-primary">
                        {format(new Date(event.eventDate), "HH:mm")}
                      </span>
                      <span className="text-sm font-semibold">{event.eventTitle}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.eventDescription}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
