import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { BreadcrumbItem, Brand, User } from '@/types';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";
import { useState } from 'react';


interface Props {
    brand: Brand;
    users: User[];
    user: true;
}


export default function BrandEditPage({ brand, users }: Props) {
    const [selectedUserId, setSelectedUserId] = useState<string>(brand.user_id.toString());
    const [selectedCategories, setSelectedCategories] = useState<string[]>(brand.category || []);
    const [isActive, setIsActive] = useState<string>(brand.is_active ? 'true' : 'false');
    const [categoryError, setCategoryError] = useState<string>('');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Brands',
            href: '/brands',
        },
        {
            title: 'Edit',
            href: `/brands/${brand.id}/edit`,
        },
    ];

    const handleUserChange = (value: string) => {
        setSelectedUserId(value);
    };

    const handleCategoryChange = (value: string, isChecked: boolean) => {
        if (isChecked) {
            setSelectedCategories([...selectedCategories, value]);
        } else {
            setSelectedCategories(selectedCategories.filter(cat => cat !== value));
        }
        setCategoryError('');
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const checkboxes = (e.currentTarget as HTMLFormElement).querySelectorAll('input[name="category[]"]');
        const anyChecked = Array.from(checkboxes).some((cb: any) => cb.checked);

        if (!anyChecked) {
            e.preventDefault();
            setCategoryError('Please select at least one category');
            return;
        }
        setCategoryError('');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Brand" />
            <Form
                method="post"
                action={`/brands/${brand.id}`}
                encType="multipart/form-data"
                disableWhileProcessing
                className="flex flex-col gap-6 p-4 max-w-6xl"
                onSubmit={handleSubmit}
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Hidden inputs to ensure all data is sent */}
                            <input type="hidden" name="user_id" value={selectedUserId} />
                            <input type="hidden" name="_method" value="PUT" />
                            <input type="hidden" name="is_active" value={isActive === 'true' ? '1' : '0'} />
                            <div className="grid gap-2 md:col-span-1">
                                <Label htmlFor="user_id">User/Owner</Label>
                                <Select value={selectedUserId} onValueChange={handleUserChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem key={user.id} value={user.id.toString()}>
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.user_id} />
                            </div>

                            <div className="grid gap-2 md:col-span-1">
                                <Label htmlFor="name">Brand Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    tabIndex={1}
                                    name="name"
                                    defaultValue={brand.name}
                                    placeholder="Brand name"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2 md:col-span-1">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    type="text"
                                    required
                                    tabIndex={2}
                                    name="slug"
                                    defaultValue={brand.slug}
                                    placeholder="brand-slug"
                                />
                                <InputError message={errors.slug} />
                            </div>

                            <div className="grid gap-2 md:col-span-1">
                                <Label>Category</Label>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="category_eo"
                                            name="category[]"
                                            value="EO"
                                            defaultChecked={Array.isArray(brand.category) && brand.category.includes('EO')}
                                        />
                                        <Label htmlFor="category_eo" className="font-normal cursor-pointer">EO</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="category_wo"
                                            name="category[]"
                                            value="WO"
                                            defaultChecked={Array.isArray(brand.category) && brand.category.includes('WO')}
                                        />
                                        <Label htmlFor="category_wo" className="font-normal cursor-pointer">WO</Label>
                                    </div>
                                </div>
                                {categoryError && <p className="text-sm text-red-500">{categoryError}</p>}
                                <InputError message={errors.category} />
                            </div>

                            <div className="grid gap-2 md:col-span-1">
                                <Label>Status</Label>
                                <RadioGroup
                                    value={isActive}
                                    onValueChange={setIsActive}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="true" id="is_active_yes" />
                                        <Label htmlFor="is_active_yes" className="font-normal cursor-pointer">Active</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="false" id="is_active_no" />
                                        <Label htmlFor="is_active_no" className="font-normal cursor-pointer">Inactive</Label>
                                    </div>
                                </RadioGroup>
                                <InputError message={errors.is_active} />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={brand.description}
                                    placeholder="Brand description"
                                    rows={4}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    defaultValue={brand.address}
                                    placeholder="Full address"
                                    rows={3}
                                />
                                <InputError message={errors.address} />
                            </div>

                            <div className="grid gap-2 md:col-span-1">
                                <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                                <Input
                                    id="whatsapp_number"
                                    type="text"
                                    name="whatsapp_number"
                                    defaultValue={brand.whatsapp_number}
                                    placeholder="+62812345678900"
                                />
                                <InputError message={errors.whatsapp_number} />
                            </div>

                            <div className="grid gap-2 md:col-span-1">
                                <Label htmlFor="instagram">Instagram</Label>
                                <Input
                                    id="instagram"
                                    type="text"
                                    name="instagram"
                                    defaultValue={brand.instagram || ''}
                                    placeholder="@username"
                                />
                                <InputError message={errors.instagram} />
                            </div>

                            <div className="grid gap-2 md:col-span-1">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    type="text"
                                    name="website"
                                    defaultValue={brand.website || ''}
                                    placeholder="www.example.com"
                                />
                                <InputError message={errors.website} />
                            </div>

                            <div className="grid gap-2 md:col-span-1">
                                <Label htmlFor="logo">Logo</Label>
                                <Input
                                    id="logo"
                                    type="file"
                                    name="logo"
                                    accept="image/*"
                                />
                                <p className="text-sm text-gray-500">Leave empty to keep current logo</p>
                                <InputError message={errors.logo} />
                            </div>

                            <div className="grid gap-2 md:col-span-1">
                                <Label htmlFor="cover_image">Cover Image</Label>
                                <Input
                                    id="cover_image"
                                    type="file"
                                    name="cover_image"
                                    accept="image/*"
                                />
                                <p className="text-sm text-gray-500">Leave empty to keep current cover image</p>
                                <InputError message={errors.cover_image} />
                            </div>

                            <div className='space-x-2 md:col-span-2'>
                                <Button type="submit" className="mt-2 w-fit">
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save changes'
                                    )}
                                </Button>
                                <Link href={'/brands'}>
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
