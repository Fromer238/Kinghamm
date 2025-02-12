import { usePermission } from '@/contexts/PermissionContext';
import { useState } from 'react';
import {
    Users,
    Settings,
    ChevronDown,
    ChevronUp,
    Package,
    PackagePlus,
    PackageMinus,
    PackageSearch,
    LineChart,
} from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function Siderbar({ isSidebarOpen }) {
    const [isClothesOpen, setClothesOpen] = useState(false);
    const { canShowModule } = usePermission();
    const router = useRouter();

    const menuItems = [
        {
            icon: Package,
            text: '成品管理',
            moduleId: 'clothes_management',
            isExpandable: true,
            isOpen: isClothesOpen,
            onClick: () => setClothesOpen(!isClothesOpen),
            subItems: [
                {
                    icon: PackagePlus,
                    text: '入庫',
                    path: '/clothes/in',
                    moduleId: 'clothes_in'
                },
                {
                    icon: PackageMinus,
                    text: '出庫',
                    path: '/clothes/out',
                    moduleId: 'clothes_out'
                },
                {
                    icon: PackageSearch,
                    text: '調整',
                    path: '/clothes/adjust',
                    moduleId: 'clothes_adj'
                },
                {
                    icon: LineChart,
                    text: '進耗存',
                    path: '/clothes/status',
                    moduleId: 'clothes_status'
                },
            ]
        },
        {
            icon: Users,
            text: '使用者管理',
            path: '/users',
            moduleId: 'user_management'
        },
        {
            icon: Settings,
            text: '系統管理',
            path: '/settings',
            moduleId: 'system_management'
        }
    ];

    return (
        <div className="py-4">
            {menuItems.map((item, index) => {
                // 檢查主模組權限
                try {
                    if (!canShowModule(item.moduleId)) {
                        return null;
                    }
                } catch (error) {
                    console.error('Permission check error:', error);
                    return null;
                }

                const Icon = item.icon;
                return (
                    <div key={index} className="relative">
                        <button
                            onClick={item.isExpandable ? item.onClick : () => router.push(item.path)}
                            className={`
          w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-indigo-600
          transition-colors duration-200
          ${isSidebarOpen ? 'justify-between' : 'justify-center'}
        `}
                        >
                            <div className="flex items-center min-w-0">
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                {isSidebarOpen && (
                                    <span className="ml-3 truncate">{item.text}</span>
                                )}
                            </div>
                            {item.isExpandable && isSidebarOpen && (
                                item.isOpen ?
                                    <ChevronUp className="h-4 w-4" /> :
                                    <ChevronDown className="h-4 w-4" />
                            )}
                        </button>

                        {/* 子選單 */}
                        {item.isExpandable && item.isOpen && isSidebarOpen && (
                            <div className="bg-gray-50">
                                {item.subItems.map((subItem, subIndex) => {
                                    // 檢查子模組權限
                                    if (!canShowModule(subItem.moduleId)) {
                                        return null;  // 如果沒有權限就不渲染此子項目
                                    }

                                    const SubIcon = subItem.icon;
                                    return (
                                        <button
                                            key={subIndex}
                                            onClick={() => router.push(subItem.path)}
                                            className="
                  w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-indigo-600
                  pl-12 text-sm transition-colors duration-200
                "
                                        >
                                            <SubIcon className="h-4 w-4 flex-shrink-0" />
                                            <span className="ml-3 truncate">{subItem.text}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>

    )
}