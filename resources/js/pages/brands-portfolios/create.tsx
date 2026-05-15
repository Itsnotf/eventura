import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { BreadcrumbItem, Brand } from '@/types';
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
        title: 'Brand Portfolios',
        href: '/brand-portfolios',
    },
    {
        title: 'Create',
        href: '/brand-portfolios/create',
    },
];

const eventTypes = [
    'Wedding',
    'Corporate',
    'Birthday',
    'Conference',
    'Concert',
    'Festival',
    'Product Launch',
    'Exhibition',
    'Other'
];

export default function BrandPortfolioCreatePage({ brands }: Props) {
    const [brandId, setBrandId] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [eventType, setEventType] = useState<string>('');
    const [eventDate, setEventDate] = useState<string>('');
    const [deskripsi, setDeskripsi] = useState<string>('');

    const handleSubmit = (_e: React.FormEvent<HTMLFormElement>) => {
        // Form will be submitted normally
    };

    if (brands.length === 0) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Create Brand Portfolio" />
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
            <Head title="Create Brand Portfolio" />
            <Form
                method="post"
                action={'/brand-portfolios'}
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
                                <Label htmlFor="title">Portfolio Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    name="title"
                                    placeholder="e.g., Grand Wedding Ceremony 2026"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <input type="hidden" name="title" value={title} />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2 md:col-span-1">
                                <Label htmlFor="event_type">Event Type</Label>
                                <Select value={eventType} onValueChange={setEventType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select event type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {eventTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <input type="hidden" name="event_type" value={eventType} />
                                <InputError message={errors.event_type} />
                            </div>

                            <div className="grid gap-2 md:col-span-1">
                                <Label htmlFor="event_date">Event Date</Label>
                                <Input
                                    id="event_date"
                                    type="date"
                                    required
                                    tabIndex={2}
                                    name="event_date"
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                />
                                <input type="hidden" name="event_date" value={eventDate} />
                                <InputError message={errors.event_date} />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="deskripsi">Description</Label>
                                <Textarea
                                    id="deskripsi"
                                    name="deskripsi"
                                    placeholder="Provide detailed description about the event and portfolio highlights"
                                    rows={5}
                                    value={deskripsi}
                                    onChange={(e) => setDeskripsi(e.target.value)}
                                    required
                                />
                                <input type="hidden" name="deskripsi" value={deskripsi} />
                                <InputError message={errors.deskripsi} />
                            </div>

                            <div className='space-x-2 md:col-span-2'>
                                <Button type="submit" className="mt-2 w-fit">
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-2" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Portfolio'
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
