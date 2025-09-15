
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ShieldAlert, Package, Star, Megaphone, ShoppingCart, Users, Trash2, PlusCircle, ChevronDown, Wifi, PartyPopper, ThumbsUp, ThumbsDown, Check, X, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ProductPieChart from './charts/ProductPieChart';
import ProductBarChart from './charts/ProductBarChart';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { AdminRole, AdminUser, CelebrationPopupConfig, DealSubmission, DeliveryRoute } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { getDealSubmissions, approveDeal, rejectDeal } from '@/lib/data';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { addDeliveryRoute, getDeliveryRoutes, deleteDeliveryRoute } from '@/lib/locations';
import { allCategories } from '@/lib/categories';


export default function AdminDashboard() {
  const { 
    isAdmin, 
    isSuperAdmin, 
    loading, 
    admins, 
    addAdmin, 
    removeAdmin, 
    updateAdminRole, 
    totalUsers, 
    onlineUsers,
    celebrationPopupConfig,
    updateCelebrationPopupConfig 
  } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>('Normal Admin');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [openCategoryPopover, setOpenCategoryPopover] = useState(false);
  const [analyticsCategory, setAnalyticsCategory] = useState('all');
  const [popupSettings, setPopupSettings] = useState<CelebrationPopupConfig>({
      title: '',
      message: '',
      isActive: false,
  });
  const [dealSubmissions, setDealSubmissions] = useState<DealSubmission[]>([]);
  const [deliveryRoutes, setDeliveryRoutes] = useState<DeliveryRoute[]>([]);
  const [newRoute, setNewRoute] = useState({ from: 'Ogbomoso', to: 'Iseyin', price: 0 });

  const fetchRoutes = async () => {
    const routes = await getDeliveryRoutes();
    setDeliveryRoutes(routes);
  }

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/auth/signin');
    }
     if (celebrationPopupConfig) {
      setPopupSettings(celebrationPopupConfig);
    }
    if (isSuperAdmin) {
        fetchDeals();
        fetchRoutes();
    }
  }, [isAdmin, loading, router, celebrationPopupConfig, isSuperAdmin]);
  
  const fetchDeals = async () => {
    const submissions = await getDealSubmissions();
    setDealSubmissions(submissions);
  };
  
  const handleApproveDeal = async (submission: DealSubmission) => {
    await approveDeal(submission.id, submission.productId, submission.proposedPrice);
    toast({ title: 'Deal Approved', description: `${submission.productName} is now on sale.` });
    fetchDeals();
  };

  const handleRejectDeal = async (submission: DealSubmission) => {
    await rejectDeal(submission.id, submission.productId);
    toast({ title: 'Deal Rejected', description: `The deal for ${submission.productName} has been rejected.`, variant: 'destructive' });
    fetchDeals();
  };

  const handleAddRoute = async () => {
    if(newRoute.price <= 0) {
        toast({ title: 'Invalid Price', description: 'Price must be greater than 0.', variant: 'destructive'});
        return;
    }
    await addDeliveryRoute(newRoute);
    toast({ title: 'Route Added', description: `Delivery from ${newRoute.from} to ${newRoute.to} is now ₦${newRoute.price}.`});
    fetchRoutes();
    setNewRoute({ from: 'Ogbomoso', to: 'Iseyin', price: 0 });
  };

  const handleDeleteRoute = async (routeId: string) => {
    await deleteDeliveryRoute(routeId);
    toast({ title: 'Route Deleted', description: 'The delivery route has been removed.', variant: 'destructive'});
    fetchRoutes();
  };


  const formatCategoryName = (slug: string) => {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  const handleAddAdmin = () => {
    if (newAdminEmail && /\S+@\S+\.\S+/.test(newAdminEmail)) {
        addAdmin(newAdminEmail, newAdminRole, selectedCategories);
        toast({ title: 'Admin Added', description: `${newAdminEmail} is now a ${newAdminRole}.` });
        setNewAdminEmail('');
        setSelectedCategories([]);
    } else {
        toast({ title: 'Invalid Email', description: 'Please enter a valid email address.', variant: 'destructive' });
    }
  };

  const handleRemoveAdmin = (email: string) => {
      removeAdmin(email);
      toast({ title: 'Admin Removed', description: `${email} is no longer an admin.`, variant: 'destructive'});
  };

  const handleRoleChange = (email: string, role: AdminRole, categories?: string[]) => {
      updateAdminRole(email, role, categories);
      toast({ title: 'Role Updated', description: `${email}'s role has been changed.`});
  }

  const handleSavePopupSettings = () => {
    updateCelebrationPopupConfig(popupSettings);
    toast({
        title: 'Pop-up Settings Saved',
        description: 'The celebration pop-up has been updated.',
    });
  };

  const AdminEditor = ({ admin, children }: { admin: AdminUser; children: React.ReactNode }) => {
    const [role, setRole] = useState(admin.role);
    const [categories, setCategories] = useState(admin.managedCategories || []);
    
    const onRoleChange = (newRole: AdminRole) => {
        setRole(newRole);
        handleRoleChange(admin.email, newRole, categories);
    }
    
    const onCategoryChange = (newCategories: string[]) => {
        setCategories(newCategories);
        handleRoleChange(admin.email, role, newCategories);
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Edit Admin</h4>
                        <p className="text-sm text-muted-foreground">
                            Update role and permissions for {admin.email}.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    {role}
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {(['Normal Admin', 'Products Admin', 'Website Admin'] as AdminRole[]).map(r => (
                                    <DropdownMenuItem key={r} onClick={() => onRoleChange(r)}>
                                        {r}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                         {role === 'Normal Admin' && (
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start">
                                        <div className="flex gap-1 items-center flex-wrap">
                                            {categories.length > 0 ? categories.map(c => <Badge key={c} variant="secondary">{formatCategoryName(c)}</Badge>) : "Assign Categories"}
                                        </div>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-60 p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Filter categories..." />
                                        <CommandList>
                                            <CommandEmpty>No results found.</CommandEmpty>
                                            <CommandGroup>
                                                {allCategories.map((option) => (
                                                    <CommandItem
                                                        key={option}
                                                        onSelect={() => {
                                                          const newSelection = categories.includes(option)
                                                            ? categories.filter((c) => c !== option)
                                                            : [...categories, option];
                                                          onCategoryChange(newSelection);
                                                        }}
                                                    >
                                                        <Check className={cn("mr-2 h-4 w-4", categories.includes(option) ? "opacity-100" : "opacity-0")} />
                                                        <span>{formatCategoryName(option)}</span>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                         )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (!isAdmin) {
    return (
        <div className="container mx-auto py-12 md:py-24 flex justify-center">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <ShieldAlert className="mx-auto h-16 w-16 text-destructive" />
                    <CardTitle className="text-2xl">Access Denied</CardTitle>
                    <CardDescription>
                        You do not have permission to view this page. Please sign in with an admin account.
                    </CardDescription>
                </CardHeader>
            </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {isSuperAdmin && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{totalUsers}</div>
                      <p className="text-xs text-muted-foreground">Total registered users</p>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Users Online</CardTitle>
                      <Wifi className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{onlineUsers}</div>
                      <p className="text-xs text-muted-foreground">Active in the last minute</p>
                  </CardContent>
              </Card>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                        <CardTitle>Store Analytics</CardTitle>
                        <CardDescription>An overview of your store's performance.</CardDescription>
                    </div>
                    <Select value={analyticsCategory} onValueChange={setAnalyticsCategory}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Products</SelectItem>
                            {allCategories.map(cat => (
                                <SelectItem key={cat} value={cat}>{formatCategoryName(cat)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="sold">
                        <TabsList className="mb-4">
                            <TabsTrigger value="sold">Products Sold</TabsTrigger>
                            <TabsTrigger value="refunds">Refunds</TabsTrigger>
                            <TabsTrigger value="views">Product Views</TabsTrigger>
                            <TabsTrigger value="delivered">Delivered</TabsTrigger>
                        </TabsList>
                        <TabsContent value="sold">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <ProductPieChart category={analyticsCategory} />
                                <ProductBarChart category={analyticsCategory} />
                            </div>
                        </TabsContent>
                        <TabsContent value="refunds">
                            <div className="text-center py-10 text-muted-foreground">
                                Refund analytics are not yet available.
                            </div>
                        </TabsContent>
                        <TabsContent value="views">
                            <div className="text-center py-10 text-muted-foreground">
                                Product view analytics are not yet available.
                            </div>
                        </TabsContent>
                        <TabsContent value="delivered">
                            <div className="text-center py-10 text-muted-foreground">
                                Delivery analytics are not yet available.
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
        
        {isSuperAdmin && (
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5" /> Manage Admins</CardTitle>
                        <CardDescription>Add, remove, and assign roles to administrators.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                             <Input 
                                type="email"
                                placeholder="new.admin@example.com"
                                value={newAdminEmail}
                                onChange={(e) => setNewAdminEmail(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between">
                                            {newAdminRole}
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {(['Normal Admin', 'Products Admin', 'Website Admin'] as AdminRole[]).map(role => (
                                            <DropdownMenuItem key={role} onClick={() => setNewAdminRole(role)}>
                                                {role}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {newAdminRole === 'Normal Admin' && (
                                    <Popover open={openCategoryPopover} onOpenChange={setOpenCategoryPopover}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                <div className="flex gap-1 items-center flex-wrap">
                                                    {selectedCategories.length > 0 ? selectedCategories.map(c => <Badge key={c} variant="secondary">{formatCategoryName(c)}</Badge>) : "Assign Categories"}
                                                </div>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-60 p-0" align="start">
                                            <Command>
                                                <CommandInput placeholder="Filter..." />
                                                <CommandList>
                                                    <CommandEmpty>No results found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {allCategories.map((option) => (
                                                            <CommandItem
                                                                key={option}
                                                                onSelect={() => {
                                                                    setSelectedCategories(prev => 
                                                                        prev.includes(option) ? prev.filter(p => p !== option) : [...prev, option]
                                                                    );
                                                                }}
                                                            >
                                                                <Check className={cn("mr-2 h-4 w-4", selectedCategories.includes(option) ? "opacity-100" : "opacity-0")} />
                                                                <span>{formatCategoryName(option)}</span>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </div>
                            <Button onClick={handleAddAdmin} className="w-full">
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Admin
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Current Admins</h4>
                            <div className="space-y-2 pr-2 max-h-60 overflow-y-auto">
                                {admins.map(admin => (
                                    <div key={admin.email} className="flex items-center justify-between p-2 rounded-md bg-secondary">
                                        <div className="flex flex-col">
                                            <span className="text-sm truncate font-medium">{admin.email}</span>
                                            <div className='flex items-center gap-1 flex-wrap'>
                                                <Badge variant="secondary" className="w-fit">{admin.role}</Badge>
                                                {admin.role === 'Normal Admin' && admin.managedCategories?.map(cat => (
                                                    <Badge key={cat} variant="outline" className="w-fit">{formatCategoryName(cat)}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <AdminEditor admin={admin}>
                                                <Button variant="ghost" size="sm" className="h-7" disabled={admin.role === 'Super Admin'}>
                                                    Edit
                                                </Button>
                                            </AdminEditor>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-destructive hover:text-destructive"
                                                onClick={() => handleRemoveAdmin(admin.email)}
                                                disabled={admin.role === 'Super Admin'}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )}

       </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    Product Management
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <CardDescription>
                    Add, edit, and manage your products.
                    </CardDescription>
                    <Button asChild className="mt-4">
                        <Link href="/admin/products">Go to Products</Link>
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    Order Management
                    </CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <CardDescription>
                    View and update customer orders.
                    </CardDescription>
                    <Button asChild className="mt-4">
                        <Link href="/admin/orders">Go to Orders</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>


      {isSuperAdmin && (
          <div className='mt-6 space-y-6'>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><Megaphone className="mr-2 h-5 w-5" /> Today's Deals Approval</CardTitle>
                    <CardDescription>Approve or reject deal submissions from other admins.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="pending">
                        <TabsList>
                            <TabsTrigger value="pending">Pending ({dealSubmissions.filter(d => d.status === 'pending').length})</TabsTrigger>
                            <TabsTrigger value="approved">Approved ({dealSubmissions.filter(d => d.status === 'approved').length})</TabsTrigger>
                            <TabsTrigger value="rejected">Rejected ({dealSubmissions.filter(d => d.status === 'rejected').length})</TabsTrigger>
                        </TabsList>
                        <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
                            <TabsContent value="pending">
                                {dealSubmissions.filter(d => d.status === 'pending').map(sub => (
                                    <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                        <div className="flex items-center gap-4">
                                            <Image src={sub.productImage} alt={sub.productName} width={50} height={50} className="rounded-md object-cover" />
                                            <div>
                                                <p className="font-semibold">{sub.productName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    <span className="line-through">₦{sub.originalPrice.toFixed(2)}</span>
                                                    <span className="text-destructive font-bold ml-2">₦{sub.proposedPrice.toFixed(2)}</span>
                                                </p>
                                                <p className="text-xs text-muted-foreground italic">Submitted by: {sub.submittedBy}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild><Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-100 hover:text-green-700"><ThumbsUp /></Button></AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Approve Deal?</AlertDialogTitle><AlertDialogDescription>This will set the sale price for {sub.productName} to ₦{sub.proposedPrice.toFixed(2)} and make it live.</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleApproveDeal(sub)} className="bg-green-600 hover:bg-green-700">Approve</AlertDialogAction></AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild><Button size="sm" variant="destructive"><ThumbsDown /></Button></AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Reject Deal?</AlertDialogTitle><AlertDialogDescription>This will reject the deal submission for {sub.productName}. The price will not be changed.</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleRejectDeal(sub)} className="bg-destructive hover:bg-destructive/90">Reject</AlertDialogAction></AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                ))}
                                {dealSubmissions.filter(d => d.status === 'pending').length === 0 && <p className="text-muted-foreground text-center py-4">No pending deals.</p>}
                            </TabsContent>
                            <TabsContent value="approved">
                                {dealSubmissions.filter(d => d.status === 'approved').map(sub => (
                                    <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg border bg-green-50 dark:bg-green-950/20">
                                       <div className="flex items-center gap-4">
                                            <Image src={sub.productImage} alt={sub.productName} width={50} height={50} className="rounded-md object-cover" />
                                            <div>
                                                <p className="font-semibold">{sub.productName}</p>
                                                <p className="text-sm"><span className="line-through">₦{sub.originalPrice.toFixed(2)}</span><span className="text-green-600 font-bold ml-2">₦{sub.proposedPrice.toFixed(2)}</span></p>
                                            </div>
                                        </div>
                                        <Check className="text-green-600" />
                                    </div>
                                ))}
                                {dealSubmissions.filter(d => d.status === 'approved').length === 0 && <p className="text-muted-foreground text-center py-4">No approved deals yet.</p>}
                            </TabsContent>
                            <TabsContent value="rejected">
                                 {dealSubmissions.filter(d => d.status === 'rejected').map(sub => (
                                    <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg border bg-red-50 dark:bg-red-950/20">
                                        <div className="flex items-center gap-4">
                                            <Image src={sub.productImage} alt={sub.productName} width={50} height={50} className="rounded-md object-cover" />
                                            <div>
                                                <p className="font-semibold">{sub.productName}</p>
                                                <p className="text-sm text-muted-foreground line-through">₦{sub.proposedPrice.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <X className="text-red-600" />
                                    </div>
                                ))}
                                {dealSubmissions.filter(d => d.status === 'rejected').length === 0 && <p className="text-muted-foreground text-center py-4">No rejected deals.</p>}
                            </TabsContent>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><MapPin className="mr-2 h-5 w-5" /> Location Settings</CardTitle>
                    <CardDescription>Manage delivery routes and prices between campuses.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                             <Select value={newRoute.from} onValueChange={(value: 'Ogbomoso' | 'Iseyin') => setNewRoute(p => ({...p, from: value}))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="Ogbomoso">From: Ogbomoso</SelectItem><SelectItem value="Iseyin">From: Iseyin</SelectItem></SelectContent>
                             </Select>
                             <Select value={newRoute.to} onValueChange={(value: 'Ogbomoso' | 'Iseyin') => setNewRoute(p => ({...p, to: value}))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="Ogbomoso">To: Ogbomoso</SelectItem><SelectItem value="Iseyin">To: Iseyin</SelectItem></SelectContent>
                             </Select>
                            <Input 
                                type="number"
                                placeholder="Price"
                                value={newRoute.price}
                                onChange={(e) => setNewRoute(p => ({...p, price: e.target.valueAsNumber}))}
                                className="md:col-span-1"
                             />
                             <Button onClick={handleAddRoute} className="md:col-span-1">Add Route</Button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            <h4 className="font-medium text-sm">Current Routes</h4>
                            {deliveryRoutes.map(route => (
                                <div key={route.id} className="flex items-center justify-between p-2 rounded-md bg-secondary">
                                    <p className="text-sm font-medium">From {route.from} to {route.to}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">₦{route.price.toFixed(2)}</span>
                                         <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-destructive hover:text-destructive"
                                            onClick={() => handleDeleteRoute(route.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {deliveryRoutes.length === 0 && <p className="text-muted-foreground text-sm text-center py-2">No routes defined.</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><PartyPopper className="mr-2 h-5 w-5" /> Site-wide Promotions</CardTitle>
                    <CardDescription>Control a site-wide pop-up for special announcements or greetings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch 
                            id="popup-active" 
                            checked={popupSettings.isActive}
                            onCheckedChange={(checked) => setPopupSettings(prev => ({...prev, isActive: checked}))}
                        />
                        <Label htmlFor="popup-active">Activate Pop-up</Label>
                    </div>
                    <div>
                        <Label htmlFor="popup-title">Pop-up Title</Label>
                        <Input 
                            id="popup-title"
                            placeholder="e.g., Happy Holidays!"
                            value={popupSettings.title}
                            onChange={(e) => setPopupSettings(prev => ({...prev, title: e.target.value}))}
                        />
                    </div>
                    <div>
                        <Label htmlFor="popup-message">Pop-up Message</Label>
                        <Textarea
                            id="popup-message"
                            placeholder="e.g., All items are 10% off this week."
                            value={popupSettings.message}
                            onChange={(e) => setPopupSettings(prev => ({...prev, message: e.target.value}))}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSavePopupSettings}>Save Pop-up Settings</Button>
                    </div>
                </CardContent>
            </Card>
          </div>
       )}


       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
         <Card>
           <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5" />
              Review Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
                Approve and manage customer reviews.
            </CardDescription>
             <Button variant="secondary" disabled className="mt-4">
                Post Reviews
            </Button>
             <Button variant="destructive" disabled className="mt-4 ml-2">
                Delete Review
            </Button>
          </CardContent>
        </Card>
       </div>
    </div>
  );
}
