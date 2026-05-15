import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { BreadcrumbItem, Brand, BrandPortfolio } from '@/types';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';


interface Props {
    brandPortfolio: BrandPortfolio;
    brands: Brand[];
}


export default function BrandPortfolioEditPage({ brandPortfolio, brands }: Props) {
    const [brandId, setBrandId] = useState<string>(brandPortfolio.brand_id.toString());
    const [title, setTitle] = useState<string>(brandPortfolio.title);
    const [deskripsi, setDeskripsi] = useState<string>(brandPortfolio.deskripsi);
    const [eventType, setEventType] = useState<string>(brandPortfolio.event_type);
    const [eventDate, setEventDate] = useState<string>(brandPortfolio.event_date);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Brand Portfolios',
            href: '/brand-portfolios',
        },
        {
            title: 'Edit',
            href: `/brand-portfolios/${brandPortfolio.id}/edit`,
        },
    ];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // Form will be submitted normally
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Brand Portfolio" />
            <Form
                method="post"
                action={`/brand-portfolios/${brandPortfolio.id}`}
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
                            <input type="hidden" name="title" value={title} />
                            <input type="hidden" name="deskripsi" value={deskripsi} />
                            <input type="hidden" name="event_type" value={eventType} />
                            <input type="hidden" name="event_date" value={eventDate} />

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
                                <Label htmlFor="title">Portfolio Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    required
                                    tabIndex={1}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Festival EO 2024"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2 md:col-span-1">
                                <Label htmlFor="event_type">Event Type</Label>
                                <Input
                                    id="event_type"
                                    type="text"
                                    required
                                    tabIndex={2}
                                    value={eventType}
                                    onChange={(e) => setEventType(e.target.value)}
                                    placeholder="e.g., Corporate Event, Wedding, Festival"
                                />
                                <InputError message={errors.event_type} />
                            </div>

                            <div className="grid gap-2 md:col-span-1">
                                <Label htmlFor="event_date">Event Date</Label>
                                <Input
                                    id="event_date"
                                    type="date"
                                    required
                                    tabIndex={3}
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                />
                                <InputError message={errors.event_date} />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="deskripsi">Description</Label>
                                <Textarea
                                    id="deskripsi"
                                    value={deskripsi}
                                    onChange={(e) => setDeskripsi(e.target.value)}
                                    placeholder="Portfolio description and event details"
                                    rows={4}
                                    required
                                />
                                <InputError message={errors.deskripsi} />
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
                                <Link href={'/brand-portfolios'}>
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
