import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Search, Filter, Download, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';

export function BeneficiaryManagement() {
  const beneficiaries = [
    { id: 'BEN-001', name: 'John Doe', member: 'Self', category: 'Primary', status: 'Active', registeredOn: 'Jan 15, 2026' },
    { id: 'BEN-002', name: 'Jane Doe', member: 'Spouse', category: 'Primary', status: 'Active', registeredOn: 'Jan 15, 2026' },
    { id: 'BEN-003', name: 'Emma Doe', member: 'Daughter', category: 'Dependent', status: 'Active', registeredOn: 'Feb 10, 2026' },
    { id: 'BEN-004', name: 'Noah Doe', member: 'Son', category: 'Dependent', status: 'Active', registeredOn: 'Feb 10, 2026' },
  ];

  return (
    <DashboardLayout role="user" title="Beneficiary Management">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600">Total Beneficiaries</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">4</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600 mt-1">4</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Primary</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">2</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Dependent</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">2</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search beneficiaries..." className="pl-10" />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </Card>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Beneficiary ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Family Member</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registered On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {beneficiaries.map((beneficiary) => (
                <TableRow key={beneficiary.id}>
                  <TableCell className="font-medium">{beneficiary.id}</TableCell>
                  <TableCell>{beneficiary.name}</TableCell>
                  <TableCell>{beneficiary.member}</TableCell>
                  <TableCell>
                    <Badge variant={beneficiary.category === 'Primary' ? 'default' : 'secondary'}>
                      {beneficiary.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {beneficiary.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{beneficiary.registeredOn}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
