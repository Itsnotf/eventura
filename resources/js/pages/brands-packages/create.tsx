import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { BreadcrumbItem, Brand } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';


interface Props {
    brands: Brand[];
}


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Brand Packages',
        href: '/brand-packages',
    },
    {
        title: 'Create',
        href: '/brand-packages/create',
    },
];

export default function BrandPackageCreatePage({ brands }: Props) {
    const [brandId, setBrandId] = useState<string>('');
    const [packageName, setPackageName] = useState<string>('');
    const [priceStart, setPriceStart] = useState<string>('');
    const [priceEnd, setPriceEnd] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isFeatured, setIsFeatured] = useState<boolean>(false);

    const handleSubmit = (_e: React.FormEvent<HTMLFormElement>) => {
        // Form will be submitted normally
    };

    if (brands.length === 0) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Create Brand Package" />
                <div className="flex flex-col items-center justify-center h-[70vh] gap-4 text-center">
                    <p className="text-muted-foreground text-lg">Anda belum memiliki brand, silahkan buat terlebih dahulu.</p>
                    <Link href="/brands/create">
                        <Button>Buat Brand</Button>
                    </Link>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Brand Package" />
            <Form
                method="post"
                action={'/brand-packages'}
                encType="multipart/form-data"
                disableWhileProcessing
                className="flex flex-col gap-6 p-4 max-w-6xl"
                onSubmit={handleSubmit}
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                <input type="hidden" name="brand_id" value={brandId} />
                                <InputError message={errors.brand_id} />
                            </div>

                            <div className="grid gap-2 md:col-span-1">
                                <Label htmlFor="name">Package Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    name="name"
                                    placeholder="e.g., Paket Starter Aromaterapi"
                                    value={packageName}
                                    onChange={(e) => setPackageName(e.target.value)}
                                />
                                <input type="hidden" name="name" value={packageName} />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2 md:col-span-1">
                                <Label htmlFor="price_start">Price Start (Rp)</Label>
                                <Input
                                    id="price_start"
                                    type="number"
                                    required
                                    tabIndex={2}
                                    name="price_start"
                                    placeholder="100000"
                                    value={priceStart}
                                    onChange={(e) => setPriceStart(e.target.value)}
                                />
                                <input type="hidden" name="price_start" value={priceStart} />
                                <InputError message={errors.price_start} />
                            </div>

                            <div className="grid gap-2 md:col-span-1">
                                <Label htmlFor="price_end">Price End (Rp)</Label>
                                <Input
                                    id="price_end"
                                    type="number"
                                    required
                                    tabIndex={3}
                                    name="price_end"
                                    placeholder="250000"
                                    value={priceEnd}
                                    onChange={(e) => setPriceEnd(e.target.value)}
                                />
                                <input type="hidden" name="price_end" value={priceEnd} />
                                <InputError message={errors.price_end} />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Package description and details"
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <input type="hidden" name="description" value={description} />
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
                                <InputError message={errors.cover_image} />
                            </div>

                            <div className="grid gap-2 md:col-span-1">
                                <Label className="flex items-center space-x-2 cursor-pointer">
                                    <Checkbox
                                        id="is_featured"
                                        name="is_featured"
                                        checked={isFeatured}
                                        onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                                    />
                                    <span className="font-normal">Featured Package</span>
                                </Label>
                                <input type="hidden" name="is_featured" value={isFeatured ? '1' : '0'} />
                            </div>

                            <div className='space-x-2 md:col-span-2'>
                                <Button type="submit" className="mt-2 w-fit">
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-2" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Package'
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
