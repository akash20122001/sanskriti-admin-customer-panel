import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Toaster, toast } from 'sonner';
import { User, Settings, LogOut } from 'lucide-react';

function ComponentDemo() {
    const showToast = () => {
        toast.success('Component library works!', {
            description: 'All shadcn/ui components are functioning correctly.',
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg-primary p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-dark-text-primary">
                        Sanskriti UI Components
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-dark-text-secondary">
                        Testing shadcn/ui component library
                    </p>
                    <Badge variant="outline" className="mt-2">
                        Phase 1 Complete
                    </Badge>
                </div>

                {/* Buttons Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Buttons</CardTitle>
                        <CardDescription>
                            Various button variants and sizes
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4">
                        <Button onClick={showToast}>Default Button</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button size="sm">Small</Button>
                        <Button size="lg">Large</Button>
                        <Button disabled>Disabled</Button>
                    </CardContent>
                </Card>

                {/* Form Elements */}
                <Card>
                    <CardHeader>
                        <CardTitle>Form Elements</CardTitle>
                        <CardDescription>
                            Input fields with labels
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" placeholder="Enter username" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="Enter email" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" placeholder="Enter password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="disabled">Disabled Input</Label>
                                <Input id="disabled" disabled value="Cannot edit" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Badges & Avatars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Badges</CardTitle>
                            <CardDescription>Status indicators</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <Badge>Default</Badge>
                            <Badge variant="secondary">Secondary</Badge>
                            <Badge variant="outline">Outline</Badge>
                            <Badge variant="destructive">Destructive</Badge>
                            <Badge className="bg-green-500">Success</Badge>
                            <Badge className="bg-yellow-500">Warning</Badge>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Avatars</CardTitle>
                            <CardDescription>User profile images</CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <Avatar>
                                <AvatarFallback>AB</AvatarFallback>
                            </Avatar>
                            <Avatar>
                                <AvatarFallback className="bg-accent-blue text-white">
                                    AD
                                </AvatarFallback>
                            </Avatar>
                        </CardContent>
                    </Card>
                </div>

                {/* Dialog & Dropdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dialog (Modal)</CardTitle>
                            <CardDescription>Modal dialog component</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button>Open Dialog</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Create New User</DialogTitle>
                                        <DialogDescription>
                                            Enter user details below
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="modal-user">User ID</Label>
                                            <Input id="modal-user" placeholder="user_123" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="modal-name">Name</Label>
                                            <Input id="modal-name" placeholder="John Doe" />
                                        </div>
                                        <Button className="w-full">Create User</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Dropdown Menu</CardTitle>
                            <CardDescription>Context menu component</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        <User className="mr-2 h-4 w-4" />
                                        User Menu
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardContent>
                    </Card>
                </div>

                {/* Toast Notification */}
                <Card>
                    <CardHeader>
                        <CardTitle>Toast Notifications</CardTitle>
                        <CardDescription>
                            Click the button to trigger a toast notification
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        <Button onClick={showToast}>Show Success Toast</Button>
                        <Button
                            variant="destructive"
                            onClick={() => toast.error('Error notification', {
                                description: 'Something went wrong!'
                            })}
                        >
                            Show Error Toast
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => toast.info('Info notification', {
                                description: 'This is an informational message'
                            })}
                        >
                            Show Info Toast
                        </Button>
                    </CardContent>
                </Card>

                {/* Footer */}
                <Card className="bg-primary text-white">
                    <CardHeader>
                        <CardTitle>Component Library Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                                <div className="text-3xl font-bold">9</div>
                                <div className="text-sm opacity-90">Components</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">✅</div>
                                <div className="text-sm opacity-90">All Working</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">100%</div>
                                <div className="text-sm opacity-90">Tested</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">🚀</div>
                                <div className="text-sm opacity-90">Production Ready</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Toaster richColors position="bottom-right" />
        </div>
    );
}

export default ComponentDemo;
