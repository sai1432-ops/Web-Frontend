import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { CheckCircle, Package } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';

export function StockConfirmation() {
  const confirmations = [
    { id: 'CONF-001', requestId: 'REQ-002', item: 'Dental Floss', quantity: 100, receivedQty: 100, date: 'Mar 13, 2026', status: 'Confirmed' },
    { id: 'CONF-002', requestId: 'REQ-004', item: 'Toothpaste', quantity: 75, receivedQty: 75, date: 'Mar 11, 2026', status: 'Confirmed' },
  ];

  return (
    <DashboardLayout role="dealer" title="Stock Confirmation">
      <div className="space-y-6">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">Stock Receipt Confirmation</h3>
              <p className="text-sm text-blue-700">Verify and confirm received stock items</p>
            </div>
          </div>
        </Card>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Confirmation ID</TableHead>
                <TableHead>Request ID</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {confirmations.map((conf) => (
                <TableRow key={conf.id}>
                  <TableCell className="font-medium">{conf.id}</TableCell>
                  <TableCell>{conf.requestId}</TableCell>
                  <TableCell>{conf.item}</TableCell>
                  <TableCell>{conf.quantity}</TableCell>
                  <TableCell>
                    <span className={conf.receivedQty === conf.quantity ? 'text-green-600 font-medium' : 'text-orange-600 font-medium'}>
                      {conf.receivedQty}
                    </span>
                  </TableCell>
                  <TableCell>{conf.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {conf.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View Receipt</Button>
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
