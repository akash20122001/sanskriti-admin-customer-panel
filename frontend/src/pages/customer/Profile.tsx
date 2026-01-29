import { useEffect, useState } from 'react';
import { User, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { userService } from '@/services/user.service';
import { authService } from '@/services/auth.service';

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userData, setUserData] = useState({
        userId: '',
        name: '',
        walletBalance: 0,
        role: '',
        isActive: true,
    });
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const user = await authService.getCurrentUser();

            if (user) {
                setUserData({
                    userId: user.userId,
                    name: user.name,
                    walletBalance: user.walletBalance,
                    role: user.role,
                    isActive: user.isActive,
                });
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateName = async () => {
        try {
            setSaving(true);
            await userService.updateUser(userData.userId, {
                name: userData.name,
            });
            toast.success('Name updated successfully');
        } catch (error) {
            console.error('Failed to update name:', error);
            toast.error('Failed to update name');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
            toast.error('Please fill in all password fields');
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwords.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            setSaving(true);
            // Note: You'll need to implement password change endpoint
            toast.info('Password change functionality coming soon');
            setPasswords({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            console.error('Failed to change password:', error);
            toast.error('Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account information</p>
            </div>

            {/* Profile Information */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow p-6 space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{userData.name}</h2>
                        <p className="text-gray-600 dark:text-gray-400">{userData.userId}</p>
                    </div>
                </div>

                {/* Account Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            User ID
                        </label>
                        <Input
                            value={userData.userId}
                            disabled
                            className="bg-gray-100 dark:bg-dark-bg-tertiary cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Name
                        </label>
                        <div className="flex gap-2">
                            <Input
                                value={userData.name}
                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                className="bg-white dark:bg-dark-bg-tertiary"
                            />
                            <Button onClick={handleUpdateName} disabled={saving} className="text-white">
                                <Save className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Wallet Balance
                        </label>
                        <Input
                            value={`₹${userData.walletBalance.toFixed(2)}`}
                            disabled
                            className="bg-gray-100 dark:bg-dark-bg-tertiary cursor-not-allowed font-semibold"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Role
                        </label>
                        <Input
                            value={userData.role}
                            disabled
                            className="bg-gray-100 dark:bg-dark-bg-tertiary cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Change Password</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Password
                        </label>
                        <Input
                            type="password"
                            value={passwords.currentPassword}
                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                            className="bg-white dark:bg-dark-bg-tertiary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Password
                        </label>
                        <Input
                            type="password"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                            className="bg-white dark:bg-dark-bg-tertiary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm New Password
                        </label>
                        <Input
                            type="password"
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                            className="bg-white dark:bg-dark-bg-tertiary"
                        />
                    </div>

                    <Button onClick={handleChangePassword} disabled={saving} className="w-full text-white">
                        Change Password
                    </Button>
                </div>
            </div>
        </div>
    );
}
