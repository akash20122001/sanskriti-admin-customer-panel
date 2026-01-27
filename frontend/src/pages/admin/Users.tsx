export default function UsersPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold font-display text-primary">User Management</h1>
                <p className="text-gray-600 mt-1">Manage all users and their permissions.</p>
            </div>

            {/* Placeholder */}
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">👥</span>
                    </div>
                    <h2 className="text-2xl font-bold font-display text-primary mb-2">
                        User Management Coming Soon
                    </h2>
                    <p className="text-gray-600">
                        We're building the user management interface. This will include create, read, update, and delete functionality for all users.
                    </p>
                </div>
            </div>
        </div>
    );
}
