import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { BreadcrumbItem, BrandPortfolio, ImagePortfolio, SharedData } from '@/types';
import { Edit2Icon, Trash2Icon, Calendar, Image as ImageIcon, Upload, AlertCircle, Video as VideoIcon } from 'lucide-react';
import hasAnyPermission from '@/lib/utils';
import DeleteButton from '@/components/delete-button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useRef, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

interface Props {
    brandPortfolio: BrandPortfolio;
}

export default function BrandPortfolioShowPage({ brandPortfolio }: Props) {
    const user = usePage<SharedData>().props.auth.user;
    const [uploadingImageId, setUploadingImageId] = useState<number | null>(null);
    const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Brand Portfolios',
            href: '/brand-portfolios',
        },
        {
            title: brandPortfolio.title,
            href: `/brand-portfolios/${brandPortfolio.id}`,
        },
    ];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImageId(Math.random());
        setUploadError(null);

        router.post(
            `/brand-portfolios/${brandPortfolio.id}/images`,
            { image: file },
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    setUploadingImageId(null);
                },
                onError: (errors) => {
                    setUploadingImageId(null);
                    const errorMsg = errors?.image ?? errors?.message ?? 'Failed to upload image';
                    setUploadError(errorMsg);
                },
            },
        );
    };

    const handleDeleteImage = (imageId: number) => {
        setDeletingImageId(imageId);

        router.delete(`/brand-portfolios/${brandPortfolio.id}/images/${imageId}`, {
            preserveScroll: true,
            onSuccess: () => setDeletingImageId(null),
            onError: (errors) => {
                setDeletingImageId(null);
                const errorMsg = errors?.message ?? 'Failed to delete image';
                toast.error(`Gagal menghapus gambar: ${errorMsg}`);
            },
        });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const images = brandPortfolio.images || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Portfolio - ${brandPortfolio.title}`} />

            <div className="p-4 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <ImageIcon className="w-8 h-8 text-purple-600" />
                            <h1 className="text-3xl font-bold">{brandPortfolio.title}</h1>
                        </div>
                        <p className="text-gray-500 text-sm ml-11">
                            Portfolio ID: <span className="font-mono text-gray-700">{brandPortfolio.id}</span>
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        {hasAnyPermission(['brands portfolios edit']) && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={`/brand-portfolios/${brandPortfolio.id}/edit`}>
                                        <Button
                                            variant="outline"
                                            className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300"
                                        >
                                            <Edit2Icon className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>Edit Portfolio</TooltipContent>
                            </Tooltip>
                        )}

                        {hasAnyPermission(['brands portfolios delete']) && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DeleteButton id={brandPortfolio.id} featured="brand-portfolios" />
                                </TooltipTrigger>
                                <TooltipContent>Delete Portfolio</TooltipContent>
                            </Tooltip>
                        )}

                        <Link href="/brand-portfolios">
                            <Button variant="outline">Back to List</Button>
                        </Link>
                    </div>
                </div>

                <Separator />

                {/* Event Information Card */}
                <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Event Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Event Type */}
                            <div className="bg-white rounded-lg p-4 border border-purple-100">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Event Type</label>
                                <Badge variant="secondary" className="text-base py-1">
                                    {brandPortfolio.event_type}
                                </Badge>
                            </div>

                            {/* Event Date */}
                            <div className="bg-white rounded-lg p-4 border border-purple-100">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Event Date</label>
                                <p className="text-lg font-semibold text-purple-600">
                                    {formatDate(brandPortfolio.event_date)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Brand Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Associated Brand</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-semibold text-lg text-gray-900">
                                    {brandPortfolio.brand?.name || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Slug: <span className="font-mono">{brandPortfolio.brand?.slug || '-'}</span>
                                </p>
                            </div>
                            {hasAnyPermission(['brands show']) && (
                                <Link href={`/brands/${brandPortfolio.brand_id}`}>
                                    <Button variant="outline" size="sm">
                                        View Brand
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Description */}
                {brandPortfolio.deskripsi && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Portfolio Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {brandPortfolio.deskripsi}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Video Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <VideoIcon className="w-5 h-5" />
                            Video Portfolio
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {brandPortfolio.video ? (
                            <video src={`/storage/${brandPortfolio.video}`} controls className="w-full max-h-[400px] rounded-lg bg-black" />
                        ) : (
                            <p className="text-gray-500 text-sm">Belum ada video. Tambahkan lewat halaman Edit.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Portfolio Images Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5" />
                            Portfolio Images ({images.length})
                        </CardTitle>
                        {hasAnyPermission(['brands portfolios edit']) && (
                            <div className="relative">
                                <Button
                                    disabled={uploadingImageId !== null}
                                    className="gap-2"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {uploadingImageId ? (
                                        <>
                                            <Spinner className="w-4 h-4" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            Add Image
                                        </>
                                    )}
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={uploadingImageId !== null}
                                />
                            </div>
                        )}
                    </CardHeader>
                    <CardContent>
                        {uploadError && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-red-900">Upload Failed</p>
                                    <p className="text-sm text-red-700">{uploadError}</p>
                                </div>
                            </div>
                        )}
                        {images.length === 0 ? (
                            <div className="text-center py-12">
                                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 mb-4">No images yet</p>
                                {hasAnyPermission(['brands portfolios edit']) && (
                                    <Button
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload First Image
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">No</TableHead>
                                            <TableHead>Image Preview</TableHead>
                                            <TableHead>Image Name</TableHead>
                                            <TableHead>Uploaded Date</TableHead>
                                            {hasAnyPermission(['brands portfolios edit']) && (
                                                <TableHead className="text-right">Actions</TableHead>
                                            )}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {images.map((image, index) => (
                                            <TableRow key={image.id}>
                                                <TableCell className="font-medium">{index + 1}</TableCell>
                                                <TableCell>
                                                    <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                                                        <img
                                                            src={`/storage/${image.image}`}
                                                            alt={`Portfolio ${index + 1}`}
                                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-sm text-gray-600 truncate max-w-xs">
                                                        {image.image.split('/').pop()}
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-sm text-gray-600">
                                                        {formatDate(image.created_at)}
                                                    </p>
                                                </TableCell>
                                                {hasAnyPermission(['brands portfolios edit']) && (
                                                    <TableCell className="text-right">
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                    disabled={deletingImageId === image.id}
                                                                >
                                                                    {deletingImageId === image.id ? (
                                                                        <Spinner className="w-4 h-4" />
                                                                    ) : (
                                                                        <Trash2Icon className="w-4 h-4" />
                                                                    )}
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogTitle>Delete Image</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete this image? This action cannot be undone.
                                                                </AlertDialogDescription>
                                                                <div className="flex gap-2 justify-end">
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDeleteImage(image.id)}
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </div>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Metadata */}
                <Card className="bg-gray-50">
                    <CardHeader>
                        <CardTitle className="text-sm">Metadata</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs text-gray-600">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="font-medium text-gray-800">Created:</span>
                                <p className="text-gray-600">
                                    {new Date(brandPortfolio.created_at).toLocaleString('id-ID')}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <span className="font-medium text-gray-800">Last Updated:</span>
                                <p className="text-gray-600">
                                    {new Date(brandPortfolio.updated_at).toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-dashed">
                    <CardHeader>
                        <CardTitle className="text-sm">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {hasAnyPermission(['brands portfolios create']) && (
                            <Link href="/brand-portfolios/create">
                                <Button variant="outline" size="sm">
                                    + Create New Portfolio
                                </Button>
                            </Link>
                        )}
                        <Link href="/brand-portfolios">
                            <Button variant="outline" size="sm">
                                View All Portfolios
                            </Button>
                        </Link>
                        {hasAnyPermission(['brands show']) && (
                            <Link href={`/brands/${brandPortfolio.brand_id}`}>
                                <Button variant="outline" size="sm">
                                    View Associated Brand
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
