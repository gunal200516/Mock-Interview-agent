"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Briefcase, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Filter,
  Search,
  MoreHorizontal
} from 'lucide-react';
import { api, Application } from '@/lib/api';

interface ApplicationWithDetails extends Application {
  nextSteps?: string;
  contactPerson?: string;
  contactEmail?: string;
  applicationDeadline?: string;
  interviewDates?: string[];
}

const applicationStatuses = {
  'APPLIED': { color: 'bg-blue-500/10 text-blue-400', label: 'Applied' },
  'INTERVIEW': { color: 'bg-amber-500/10 text-amber-400', label: 'Interview' },
  'OFFER': { color: 'bg-green-500/10 text-green-400', label: 'Offer' },
  'REJECTED': { color: 'bg-red-500/10 text-red-400', label: 'Rejected' },
  'WITHDRAWN': { color: 'bg-gray-500/10 text-gray-400', label: 'Withdrawn' }
} as const;

// Mock data for demo - in production this would come from API
const mockApplications: ApplicationWithDetails[] = [
  {
    id: 'app-jpm',
    company: 'J.P. Morgan',
    department: 'Investment Banking Division',
    position: 'Investment Banking Analyst',
    status: 'INTERVIEW',
    appliedDate: '2025-07-01',
    notes: 'Applied through campus recruiting. Great cultural fit.',
    nextSteps: 'Prepare for final round interview',
    contactPerson: 'Sarah Johnson',
    contactEmail: 'sarah.johnson@jpm.com',
    interviewDates: ['2025-07-15', '2025-07-22']
  },
  {
    id: 'app-gs',
    company: 'Goldman Sachs',
    department: 'Global Markets',
    position: 'Sales & Trading Analyst',
    status: 'APPLIED',
    appliedDate: '2025-06-28',
    notes: 'Networking contact referred me to the team.',
    nextSteps: 'Follow up in 1 week if no response',
    contactPerson: 'Michael Chen',
    contactEmail: 'michael.chen@gs.com'
  },
  {
    id: 'app-ms',
    company: 'Morgan Stanley',
    department: 'M&A Advisory',
    position: 'Investment Banking Analyst',
    status: 'INTERVIEW',
    appliedDate: '2025-06-25',
    notes: 'Strong technical interview performance.',
    nextSteps: 'Technical round scheduled for tomorrow',
    contactPerson: 'Emily Rodriguez',
    contactEmail: 'emily.rodriguez@ms.com',
    interviewDates: ['2025-07-06']
  },
  {
    id: 'app-laz',
    company: 'Lazard',
    department: 'Restructuring',
    position: 'Restructuring Analyst',
    status: 'OFFER',
    appliedDate: '2025-06-20',
    notes: 'Received offer! Negotiating terms.',
    nextSteps: 'Respond to offer by Friday',
    contactPerson: 'David Kim',
    contactEmail: 'david.kim@lazard.com'
  },
  {
    id: 'app-cs',
    company: 'Credit Suisse',
    department: 'Healthcare Coverage',
    position: 'Investment Banking Analyst',
    status: 'REJECTED',
    appliedDate: '2025-06-15',
    notes: 'Made it to final round but didn\'t get the offer.',
    nextSteps: 'Request feedback and maintain relationships'
  }
];

export function ApplicationTracker() {
  const [applications, setApplications] = useState<ApplicationWithDetails[]>(mockApplications);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter applications based on status and search
  const filteredApplications = applications.filter(app => {
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Group applications by status for Kanban view
  const applicationsByStatus = Object.keys(applicationStatuses).reduce((acc, status) => {
    acc[status] = applications.filter(app => app.status === status);
    return acc;
  }, {} as Record<string, ApplicationWithDetails[]>);

  const getStatusInfo = (status: keyof typeof applicationStatuses) => {
    return applicationStatuses[status] || applicationStatuses.APPLIED;
  };

  const updateApplicationStatus = async (id: string, newStatus: keyof typeof applicationStatuses) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
    
    // In production, call API
    // await api.updateApplication(id, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(applicationStatuses).map(([status, info]) => {
          const count = applicationsByStatus[status]?.length || 0;
          return (
            <Card key={status}>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{count}</div>
                  <p className="text-xs text-muted-foreground">{info.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Application
        </Button>
      </div>

      {/* Application Views */}
      <Tabs defaultValue="kanban" className="w-full">
        <TabsList>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(applicationStatuses).map(([status, info]) => {
              const apps = applicationsByStatus[status] || [];
              return (
                <div key={status} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm">{info.label}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {apps.length}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {apps.map((app) => (
                      <Card key={app.id} className="hover:bg-accent/50 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm leading-tight">{app.company}</h4>
                            <p className="text-xs text-muted-foreground leading-tight">
                              {app.department}
                            </p>
                            {app.nextSteps && (
                              <p className="text-xs text-primary leading-tight">
                                Next: {app.nextSteps}
                              </p>
                            )}
                            <div className="flex items-center justify-between pt-2">
                              <span className="text-xs text-muted-foreground">
                                {new Date(app.appliedDate).toLocaleDateString()}
                              </span>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <Card key={app.id} className="hover:bg-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                    <div className="space-y-1">
                      <h4 className="font-medium">{app.company}</h4>
                      <p className="text-sm text-muted-foreground">{app.department}</p>
                      <p className="text-xs text-muted-foreground">{app.position}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusInfo(app.status as keyof typeof applicationStatuses).color}`}
                      >
                        {getStatusInfo(app.status as keyof typeof applicationStatuses).label}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Applied: {new Date(app.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      {app.contactPerson && (
                        <p className="text-sm font-medium">{app.contactPerson}</p>
                      )}
                      {app.contactEmail && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{app.contactEmail}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {app.nextSteps && (
                        <p className="text-sm text-primary">{app.nextSteps}</p>
                      )}
                      {app.interviewDates && app.interviewDates.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Interview: {new Date(app.interviewDates[0]).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {app.notes && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {app.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}