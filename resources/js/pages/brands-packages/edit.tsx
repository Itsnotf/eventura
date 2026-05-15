import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { BreadcrumbItem, Brand, BrandPackage } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';


interface Props {
    brandPackage: BrandPackage;
    brands: Brand[];
}


export default function BrandPackageEditPage({ brandPackage, brands }: Props) {
    const [brandId, setBrandId] = useState<string>(brandPackage.brand_id.toString());
    const [packageName, setPackageName] = useState<string>(brandPackage.name);
    const [priceStart, setPriceStart] = useState<string>(brandPackage.price_start);
    const [priceEnd, setPriceEnd] = useState<string>(brandPackage.price_end);
    const [description, setDescription] = useState<string>(brandPackage.description || '');
    const [isFeatured, setIsFeatured] = useState<boolean>(brandPackage.is_featured);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Brand Packages',
            href: '/brand-packages',
        },
        {
            title: 'Edit',
            href: `/brand-packages/${brandPackage.id}/edit`,
        },
    ];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // Form will be submitted normally
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Brand Package" />
            <Form
                method="post"
                action={`/brand-packages/${brandPackage.id}`}
                encType="multipart/form-data"
                disableWhileProcessing
                className="flex flex-col gap-6 p-4 max-w-6xl"
                onSubmit={handleSubmit}
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Hidden inputs for method spoofing and data submission */}
                            <input type="hidden" name="_method" value="PUT" />
                            <input type="hidden" name="brand_id" value={brandId} />
                            <input type="hidden" name="name" value={packageName} />
                            <input type="hidden" name="price_start" value={priceStart} />
                            <input type="hidden" name="price_end" value={priceEnd} />
                            <input type="hidden" name="description" value={description} />
                            <input type="hidden" name="is_featured" value={isFeatured ? '1' : '0'} />

                            <div className="grid gap-2 md:col-span-1">
                                <Label htmlFor="brand_id">Select Brand</Label>
                                <Select value={brandId} onValueChange={setBrandId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a brand" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {brands.map((brand) => (
                                            <SelectItem key={brand.id} value={brand.id.toString()}>
                                                {brand.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.brand_id} />
                            </div>

                            <div className="grid gap-2 md:col-span-1">
                                <Label htmlFor="name">Package Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    tabIndex={1}
                                    value={packageName}
                                    onChange={(e) => setPackageName(e.target.value)}
                                    placeholder="e.g., Paket Starter Aromaterapi"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2 md:col-span-1">
                                <Label htmlFor="price_start">Price Start (Rp)</Label>
                                <Input
                                    id="price_start"
                                    type="number"
                                    required
                                    tabIndex={2}
                                    value={priceStart}
                                    onChange={(e) => setPriceStart(e.target.value)}
                                    placeholder="100000"
                                />
                                <InputError message={errors.price_start} />
                            </div>

                            <div className="grid gap-2 md:col-span-1">
                                <Label htmlFor="price_end">Price End (Rp)</Label>
                                <Input
                                    id="price_end"
                                    type="number"
                                    required
                                    tabIndex={3}
                                    value={priceEnd}
                                    onChange={(e) => setPriceEnd(e.target.value)}
                                    placeholder="250000"
                                />
                                <InputError message={errors.price_end} />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Package description and details"
                                    rows={4}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-2 md:col-span-1">
                                <Label htmlFor="cover_image">Cover Image</Label>
                                <Input
                                    id="cover_image"
                                    type="file"
                                    name="cover_image"
                                    accept="image/*"
                                />
                                <p className="text-sm text-gray-500">Leave empty to keep current image</p>
                                <InputError message={errors.cover_image} />
                            </div>

                            <div className="grid gap-2 md:col-span-1">
                                <Label className="flex items-center space-x-2 cursor-pointer">
                                    <Checkbox
                                        id="is_featured"
                                        checked={isFeatured}
                                        onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                                    />
                                    <span className="font-normal">Featured Package</span>
                                </Label>
                            </div>

                            <div className='space-x-2 md:col-span-2'>
                                <Button type="submit" className="mt-2 w-fit">
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                                <Link href={'/brand-packages'}>
                                    <Button variant='outline' type="button" className="mt-2 w-fit">
                                        Back
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </Form>
        </AppLayout>
    );
}
