import { Checkbox } from '@/components/ui/checkbox';
import { Building2, ImageIcon, Package, ShieldCheck, Users } from 'lucide-react';

interface Permission {
    id: number;
    name: string;
}

interface PermissionPickerProps {
    permissions: Permission[];
    checkedNames: string[];
    onChange: (name: string, checked: boolean) => void;
}

const ACTION_LABELS: Record<string, string> = {
    index: 'Lihat Daftar',
    create: 'Tambah Baru',
    edit: 'Edit',
    delete: 'Hapus',
    show: 'Lihat Detail',
};

const GROUPS = [
    {
        prefix: 'users',
        label: 'Manajemen Pengguna',
        description: 'Kelola akun dan data pengguna sistem',
        Icon: Users,
    },
    {
        prefix: 'roles',
        label: 'Manajemen Role & Hak Akses',
        description: 'Kelola role dan permission pengguna',
        Icon: ShieldCheck,
    },
    // longer prefixes must come before shorter ones
    {
        prefix: 'brands packages',
        label: 'Paket Layanan Brand',
        description: 'Kelola paket dan harga layanan tiap brand',
        Icon: Package,
    },
    {
        prefix: 'brands portfolios',
        label: 'Portfolio Brand',
        description: 'Kelola foto dan portfolio event brand',
        Icon: ImageIcon,
    },
    {
        prefix: 'brands',
        label: 'Manajemen Brand',
        description: 'Kelola data brand dan mitra yang terdaftar',
        Icon: Building2,
    },
];

function findBestGroup(permName: string) {
    return GROUPS.reduce<(typeof GROUPS)[0] | null>((best, group) => {
        const matches = permName.startsWith(group.prefix + ' ') || permName === group.prefix;
        if (matches && group.prefix.length > (best?.prefix.length ?? -1)) return group;
        return best;
    }, null);
}

export function PermissionPicker({ permissions, checkedNames, onChange }: PermissionPickerProps) {
    const grouped = GROUPS.map((group) => ({
        ...group,
        items: permissions.filter((p) => findBestGroup(p.name)?.prefix === group.prefix),
    })).filter((g) => g.items.length > 0);

    const ungrouped = permissions.filter((p) => findBestGroup(p.name) === null);

    return (
        <div className="space-y-3">
            {grouped.map((group) => (
                <div key={group.prefix} className="rounded-lg border">
                    <div className="flex items-start gap-3 border-b bg-muted/40 px-4 py-3 rounded-t-lg">
                        <group.Icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                        <div>
                            <p className="text-sm font-semibold leading-none">{group.label}</p>
                            <p className="text-xs text-muted-foreground mt-1">{group.description}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-3 px-4 py-4">
                        {group.items.map((permission) => {
                            const action = permission.name.slice(group.prefix.length + 1);
                            const label = ACTION_LABELS[action] ?? action;
                            return (
                                <label key={permission.id} className="flex items-center gap-2 cursor-pointer select-none">
                                    <Checkbox
                                        checked={checkedNames.includes(permission.name)}
                                        onCheckedChange={(checked) => onChange(permission.name, !!checked)}
                                    />
                                    <span className="text-sm">{label}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            ))}

            {ungrouped.length > 0 && (
                <div className="rounded-lg border">
                    <div className="border-b bg-muted/40 px-4 py-3 rounded-t-lg">
                        <p className="text-sm font-semibold">Lainnya</p>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-3 px-4 py-4">
                        {ungrouped.map((permission) => (
                            <label key={permission.id} className="flex items-center gap-2 cursor-pointer select-none">
                                <Checkbox
                                    checked={checkedNames.includes(permission.name)}
                                    onCheckedChange={(checked) => onChange(permission.name, !!checked)}
                                />
                                <span className="text-sm">{permission.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
