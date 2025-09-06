
'use client';

import { useState, useEffect, useMemo } from 'react';
import { getAllUsersForAdmin, toggleUserStatus } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ban, CheckCircle, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

export default function UserManagementPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const { toast } = useToast();

    useEffect(() => {
        setUsers(getAllUsersForAdmin());
    }, []);

    const handleToggleStatus = (userId: string, role: string) => {
        toggleUserStatus(userId, role);
        setUsers(getAllUsersForAdmin()); // Refresh the user list
        toast({
            title: "User Status Updated",
            description: "The user's account status has been changed.",
        });
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            const matchesSearch = searchTerm === '' ||
                user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone?.includes(searchTerm);
            return matchesRole && matchesSearch;
        });
    }, [users, searchTerm, roleFilter]);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'approved': return 'secondary';
            case 'pending': return 'default';
            case 'rejected':
            case 'disabled': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-headline font-bold">User Management</h1>
                <p className="text-muted-foreground">View, manage, and moderate all users on the platform.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>A list of all registered users across all roles.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <Input
                            placeholder="Search by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-grow"
                        />
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="patient">Patient</SelectItem>
                                <SelectItem value="doctor">Doctor</SelectItem>
                                <SelectItem value="lab">Lab</SelectItem>
                                <SelectItem value="pharmacy">Pharmacy</SelectItem>
                                <SelectItem value="health-coordinator">Health Coordinator</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="hidden md:table-cell">Role</TableHead>
                                    <TableHead className="hidden sm:table-cell">Contact</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length > 0 ? filteredUsers.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.fullName || user.name}</TableCell>
                                        <TableCell className="hidden md:table-cell capitalize">
                                            {user.role.replace('-coordinator', ' Coordinator')}
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <div className="text-xs">{user.email}</div>
                                            <div className="text-xs text-muted-foreground">{user.phone || 'No phone'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(user.status)} className="capitalize">{user.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleToggleStatus(user.id, user.role)}>
                                                        {user.status === 'disabled' ? (
                                                            <><CheckCircle className="mr-2 h-4 w-4" /> Enable Account</>
                                                        ) : (
                                                            <><Ban className="mr-2 h-4 w-4" /> Disable Account</>
                                                        )}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
