import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { FileText, Download, Eye } from 'lucide-react';

export function HealthRecords() {
  const records = [
    { id: 'REC-001', type: 'Dental Checkup Report', date: 'Feb 28, 2026', member: 'John Doe', doctor: 'Dr. Sarah Johnson' },
    { id: 'REC-002', type: 'X-Ray Report', date: 'Feb 15, 2026', member: 'Emma Doe', doctor: 'Dr. Michael Chen' },
    { id: 'REC-003', type: 'Treatment Plan', date: 'Jan 20, 2026', member: 'Jane Doe', doctor: 'Dr. Emily White' },
  ];

  return (
    <DashboardLayout role="user" title="Health Records">
      <Card className="p-6">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Records</TabsTrigger>
            <TabsTrigger value="checkup">Checkups</TabsTrigger>
            <TabsTrigger value="xray">X-Rays</TabsTrigger>
            <TabsTrigger value="treatment">Treatments</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4 mt-6">
            {records.map((record) => (
              <div key={record.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{record.type}</h4>
                      <p className="text-sm text-gray-600 mt-1">{record.id} • {record.date}</p>
                      <p className="text-sm text-gray-600">Patient: {record.member} • Doctor: {record.doctor}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </Card>
    </DashboardLayout>
  );
}
