import InputError from '@/components/input-error';
import { PermissionPicker } from '@/components/permission-picker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Permission, Role } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Props {
    role: Role;
    permissions: Permission[];
}

export default function RoleEditPage({ role, permissions }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Roles', href: '/roles' },
        { title: 'Edit', href: `/roles/${role.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: role.permissions?.map((p) => p.name) ?? [],
    });

    function handlePermissionChange(name: string, checked: boolean) {
        setData(
            'permissions',
            checked ? [...data.permissions, name] : data.permissions.filter((p) => p !== name),
        );
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/roles/${role.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Role" />
            <Card className="m-4">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4">
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Role Name</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter role name"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Permissions</Label>
                            <PermissionPicker
                                permissions={permissions}
                                checkedNames={data.permissions}
                                onChange={handlePermissionChange}
                            />
                            <InputError message={errors.permissions} />
                        </div>

                        <div className="space-x-2">
                            <Button type="submit" className="mt-2 w-fit" disabled={processing}>
                                {processing && <Spinner className="mr-2" />}
                                Save changes
                            </Button>
                            <Link href="/roles">
                                <Button variant="outline" type="button" className="mt-2 w-fit">
                                    Back
                                </Button>
                            </Link>
                        </div>
                    </div>
                </form>
            </Card>
        </AppLayout>
    );
}
