import InputError from '@/components/input-error';
import { PermissionPicker } from '@/components/permission-picker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Permission {
    id: number;
    name: string;
}

interface Props {
    permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Roles', href: '/roles' },
    { title: 'Create', href: '/roles/create' },
];

export default function RoleCreatePage({ permissions }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: [] as string[],
    });

    function handlePermissionChange(name: string, checked: boolean) {
        setData(
            'permissions',
            checked ? [...data.permissions, name] : data.permissions.filter((p) => p !== name),
        );
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/roles');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />
            <Card className="m-4">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4">
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Role Name</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
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
                                Create Role
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
