
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import type { Review } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { getAllReviews, deleteReview, approveReview } from '@/lib/reviews';
import { format, parseISO } from 'date-fns';
import { Loader2, Trash2, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import StarRating from '../reviews/StarRating';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User } from 'lucide-react';
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


export default function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchReviews = async () => {
    setLoading(true);
    const allReviews = await getAllReviews();
    setReviews(allReviews);
    setLoading(false);
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (reviewId: string) => {
    setUpdatingId(reviewId);
    await approveReview(reviewId);
    toast({
        title: 'Review Approved',
        description: 'The review is now visible on the product page.',
    });
    await fetchReviews();
    setUpdatingId(null);
  }

  const handleDelete = async (reviewId: string) => {
    setUpdatingId(reviewId);
    await deleteReview(reviewId);
    toast({
        title: 'Review Deleted',
        description: 'The review has been permanently removed.',
        variant: 'destructive',
    });
    await fetchReviews();
    setUpdatingId(null);
  }
  
  if (loading) return <div className="container mx-auto py-8 text-center"><Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" /></div>;

  return (
    <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Review Management</h1>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>All Customer Reviews</CardTitle>
                <CardDescription>Approve or delete reviews submitted by customers.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Author</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Review</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reviews.map(review => (
                          <TableRow key={review.id}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={review.authorImage || ''} alt={review.authorName} />
                                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{review.authorName}</span>
                                </div>
                            </TableCell>
                             <TableCell>
                                <StarRating rating={review.rating} readOnly />
                            </TableCell>
                            <TableCell className="max-w-sm">
                                <p className="truncate">{review.text}</p>
                            </TableCell>
                            <TableCell>{review.createdAt ? format(parseISO(review.createdAt), "MMM d, yyyy") : 'N/A'}</TableCell>
                            <TableCell>
                                <Badge variant={review.isApproved ? 'default' : 'secondary'} className={review.isApproved ? 'bg-green-500 text-white' : ''}>
                                    {review.isApproved ? 'Approved' : 'Pending'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                {!review.isApproved && (
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-green-600 hover:text-green-700" 
                                        onClick={() => handleApprove(review.id)}
                                        disabled={updatingId === review.id}
                                    >
                                        {updatingId === review.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                    </Button>
                                )}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            disabled={updatingId === review.id}
                                        >
                                            {updatingId === review.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete this review.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleDelete(review.id)}
                                            className="bg-destructive hover:bg-destructive/90"
                                        >
                                            Yes, delete it
                                        </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 {reviews.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        No reviews have been submitted yet.
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
