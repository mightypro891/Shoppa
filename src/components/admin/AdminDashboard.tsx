
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ShieldAlert, Package, Star, Megaphone, ShoppingCart, Users, Trash2, PlusCircle, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ProductPieChart from './charts/ProductPieChart';
import ProductBarChart from './charts/ProductBarChart';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { AdminRole, AdminUser } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';


export default function AdminDashboard() {
  const { isAdmin, isSuperAdmin, loading, admins, addAdmin, removeAdmin, updateAdminRole } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>('Normal Admin');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [openCategoryPopover, setOpenCategoryPopover] = useState(false);
  const [analyticsCategory, setAnalyticsCategory] = useState('all');
  
  const allCategories = ['food', 'skin-care', 'gadgets', 'kitchen-utensils', 'beddings', 'home-decors', 'intimate-apparel'];

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/auth/signin');
    }
  }, [isAdmin, loading, router]);
  
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
                                        <div className="flex gap-1 items-center">
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
                                                {selectedCategories.length > 0 ? selectedCategories.map(c => formatCategoryName(c)).join(', ') : "Assign Categories"}
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
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
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


       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Review Management
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
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
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Promotions
            </CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription>
                Create and manage sales promotions.
            </CardDescription>
             <Button variant="secondary" disabled className="mt-4">
                Coming Soon
            </Button>
          </CardContent>
        </Card>
       </div>
    </div>
  );
}
