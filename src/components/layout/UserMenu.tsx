import { Dropdown, Avatar } from 'antd';
import type { MenuProps } from 'antd';
import {
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    CaretDownOutlined,
} from '@ant-design/icons';
import { clearToken } from '../../services/api';

interface UserMenuProps {
    name?: string;
    email?: string;
    variant?: 'sidebar' | 'topbar';
}

export function UserMenu({ name = 'Administrador', email = '', variant = 'sidebar' }: UserMenuProps) {

    const handleLogout = () => {
        clearToken();
        window.location.replace('/login');
    };

    const items: MenuProps['items'] = [
        {
            key: 'user-info',
            label: (
                <div className="py-1 px-1 min-w-[180px]">
                    <p className="font-bold text-sm text-on-surface mb-0 leading-tight">{name}</p>
                    {email && <p className="text-xs text-slate-400 mb-0">{email}</p>}
                </div>
            ),
            disabled: true,
        },
        { type: 'divider' },
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: <span className="text-sm font-medium">Mi perfil</span>,
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: <span className="text-sm font-medium">Configuración</span>,
        },
        { type: 'divider' },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: <span className="text-sm font-semibold text-red-500">Cerrar sesión</span>,
            onClick: handleLogout,
            danger: true,
        },
    ];

    if (variant === 'sidebar') {
        return (
            <Dropdown menu={{ items }} trigger={['click']} placement="topLeft">
                <button
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent text-left group"
                >
                    <Avatar
                        size={36}
                        style={{ background: '#006874', flexShrink: 0 }}
                        icon={<UserOutlined />}
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-on-surface mb-0 truncate leading-tight">{name}</p>
                        {email && (
                            <p className="text-xs text-slate-400 mb-0 truncate">{email}</p>
                        )}
                    </div>
                    <CaretDownOutlined className="text-slate-400 text-xs shrink-0 group-hover:text-slate-600 transition-colors" />
                </button>
            </Dropdown>
        );
    }

    return (
        <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
            <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent group">
                <Avatar
                    size={32}
                    style={{ background: '#006874', flexShrink: 0 }}
                    icon={<UserOutlined />}
                />
                <span className="text-sm font-bold text-on-surface hidden md:block">{name}</span>
                <CaretDownOutlined className="text-slate-400 text-xs group-hover:text-slate-600 transition-colors" />
            </button>
        </Dropdown>
    );
}
