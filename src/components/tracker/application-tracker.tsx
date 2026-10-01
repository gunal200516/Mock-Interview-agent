"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
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
  MoreHorizontal,
  X,
  Edit,
  Trash2
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
  const [editingApplication, setEditingApplication] = useState<ApplicationWithDetails | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [newApplication, setNewApplication] = useState({
    company: '',
    department: '',
    position: '',
    status: 'APPLIED' as keyof typeof applicationStatuses,
    notes: '',
    contactPerson: '',
    contactEmail: '',
    nextSteps: ''
  });

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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Use a consistent format that works on both server and client
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    } catch {
      return dateString;
    }
  };

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

  const handleAddApplication = () => {
    // Validate required fields
    if (!newApplication.company.trim()) {
      toast.error('Company name is required');
      return;
    }
    if (!newApplication.position.trim()) {
      toast.error('Position is required');
      return;
    }

    // Create new application
    const application: ApplicationWithDetails = {
      id: `app-${Date.now()}`,
      company: newApplication.company,
      department: newApplication.department,
      position: newApplication.position,
      status: newApplication.status,
      appliedDate: new Date().toISOString().split('T')[0],
      notes: newApplication.notes,
      contactPerson: newApplication.contactPerson,
      contactEmail: newApplication.contactEmail,
      nextSteps: newApplication.nextSteps
    };

    // Add to list
    setApplications(prev => [application, ...prev]);
    
    // Reset form
    setNewApplication({
      company: '',
      department: '',
      position: '',
      status: 'APPLIED',
      notes: '',
      contactPerson: '',
      contactEmail: '',
      nextSteps: ''
    });
    
    // Close dialog
    setShowAddForm(false);
    
    // Show success message
    toast.success(`Application to ${newApplication.company} added successfully!`);
    
    // In production, call API
    // await api.createApplication(application);
  };

  const handleCancelAdd = () => {
    setNewApplication({
      company: '',
      department: '',
      position: '',
      status: 'APPLIED',
      notes: '',
      contactPerson: '',
      contactEmail: '',
      nextSteps: ''
    });
    setEditingApplication(null);
    setShowAddForm(false);
  };

  const handleEditApplication = (app: ApplicationWithDetails) => {
    setEditingApplication(app);
    setNewApplication({
      company: app.company,
      department: app.department,
      position: app.position,
      status: app.status as keyof typeof applicationStatuses,
      notes: app.notes || '',
      contactPerson: app.contactPerson || '',
      contactEmail: app.contactEmail || '',
      nextSteps: app.nextSteps || ''
    });
    setShowAddForm(true);
  };

  const handleDeleteApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
    setShowDeleteConfirm(null);
    toast.success('Application deleted successfully');
    // In production: await api.deleteApplication(id);
  };

  const handleSaveEdit = () => {
    if (!editingApplication) return;
    
    // Validate
    if (!newApplication.company.trim() || !newApplication.position.trim()) {
      toast.error('Company and Position are required');
      return;
    }

    setApplications(prev => prev.map(app => 
      app.id === editingApplication.id 
        ? { ...app, ...newApplication }
        : app
    ));
    
    toast.success(`Application updated successfully!`);
    handleCancelAdd();
    // In production: await api.updateApplication(editingApplication.id, newApplication);
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
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(applicationStatuses).map(([status, info]) => (
                <SelectItem key={status} value={status}>
                  {info.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                                {formatDate(app.appliedDate)}
                              </span>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleEditApplication(app)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                                  onClick={() => setShowDeleteConfirm(app.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
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
                        Applied: {formatDate(app.appliedDate)}
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
                            Interview: {formatDate(app.interviewDates[0])}
                          </span>
                        </div>
                      )}
                      <div className="flex gap-1 mt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditApplication(app)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => setShowDeleteConfirm(app.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
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

      {/* Add Application Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingApplication ? 'Edit Application' : 'Add New Application'}</DialogTitle>
            <DialogDescription>
              {editingApplication ? 'Update application details' : 'Track a new job application with all relevant details'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Company & Position */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  placeholder="e.g., Goldman Sachs"
                  value={newApplication.company}
                  onChange={(e) => setNewApplication({...newApplication, company: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  placeholder="e.g., Investment Banking Analyst"
                  value={newApplication.position}
                  onChange={(e) => setNewApplication({...newApplication, position: e.target.value})}
                />
              </div>
            </div>

            {/* Department & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="e.g., M&A Advisory"
                  value={newApplication.department}
                  onChange={(e) => setNewApplication({...newApplication, department: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newApplication.status}
                  onValueChange={(value) => setNewApplication({...newApplication, status: value as keyof typeof applicationStatuses})}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(applicationStatuses).map(([status, info]) => (
                      <SelectItem key={status} value={status}>
                        {info.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Contact Person & Email */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  placeholder="e.g., Sarah Johnson"
                  value={newApplication.contactPerson}
                  onChange={(e) => setNewApplication({...newApplication, contactPerson: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="e.g., sarah.johnson@company.com"
                  value={newApplication.contactEmail}
                  onChange={(e) => setNewApplication({...newApplication, contactEmail: e.target.value})}
                />
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-2">
              <Label htmlFor="nextSteps">Next Steps</Label>
              <Input
                id="nextSteps"
                placeholder="e.g., Follow up in 1 week"
                value={newApplication.nextSteps}
                onChange={(e) => setNewApplication({...newApplication, nextSteps: e.target.value})}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about this application..."
                value={newApplication.notes}
                onChange={(e) => setNewApplication({...newApplication, notes: e.target.value})}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelAdd}>
              Cancel
            </Button>
            <Button onClick={editingApplication ? handleSaveEdit : handleAddApplication}>
              <Plus className="h-4 w-4 mr-2" />
              {editingApplication ? 'Save Changes' : 'Add Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm !== null} onOpenChange={(open) => !open && setShowDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this application? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => showDeleteConfirm && handleDeleteApplication(showDeleteConfirm)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}