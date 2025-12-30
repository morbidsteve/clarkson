'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { usePersonnelStore } from '@/lib/stores/personnel-store';
import type { Personnel } from '@/types/personnel';

type PartialPersonnel = Partial<Omit<Personnel, 'id'>>;

const initialFormState: PartialPersonnel = {
  firstName: '',
  lastName: '',
  middleName: '',
  dateOfBirth: '',
  gender: 'Male',
  maritalStatus: 'Single',
  dependents: 0,
  bloodType: 'O+',
  religion: '',
  ethnicity: '',
  email: '',
  personalEmail: '',
  phone: '',
  emergencyContact: '',
  emergencyPhone: '',
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  branch: 'Army',
  rank: '',
  payGrade: '',
  mos: '',
  activeStatus: 'Active',
  dutyStation: '',
  unit: '',
  commandingOfficer: '',
  yearsOfService: 0,
  enlistmentDate: '',
  clearanceLevel: 'None',
  clearanceDate: '',
  clearanceExpiry: '',
  accessStatus: 'Pending',
  nda: false,
  medicalReadiness: 'Green',
  dentalReadiness: 'Green',
  deploymentEligible: true,
  profileStatus: 'Fit',
  basicTrainingComplete: false,
  aitComplete: false,
  ptTestScore: 0,
  weaponsQualification: 'Marksman',
  specialSkills: [],
  certifications: [],
  vaccinations: [],
  allergies: [],
  foreignTravel: [],
  specialAccess: [],
};

export function AddPersonnelDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<PartialPersonnel>(initialFormState);
  const [activeTab, setActiveTab] = useState('personal');
  const [error, setError] = useState<string | null>(null);
  const { addPersonnel } = usePersonnelStore();

  const updateField = <K extends keyof PartialPersonnel>(
    field: K,
    value: PartialPersonnel[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setError(null);

    // Validate required fields
    if (!formData.firstName?.trim() || !formData.lastName?.trim()) {
      setError('First name and last name are required.');
      setActiveTab('personal');
      return;
    }

    if (!formData.branch || !formData.rank) {
      setError('Branch and rank are required.');
      setActiveTab('service');
      return;
    }

    // Generate email if not provided
    const email = formData.email ||
      `${formData.firstName?.toLowerCase()}.${formData.lastName?.toLowerCase()}@mail.mil`;

    const completeData = {
      ...initialFormState,
      ...formData,
      email,
      socialSecurityLastFour: Math.floor(1000 + Math.random() * 9000).toString(),
      activeDutyBaseDate: formData.enlistmentDate || new Date().toISOString().split('T')[0],
      estimatedTerminationDate: '',
      polygraphDate: '',
      polygraphType: 'None' as const,
      ndaDate: '',
      foreignContacts: 0,
      securityIncidents: 0,
      lastSecurityBriefing: new Date().toISOString().split('T')[0],
      lastInvestigation: {
        type: 'NACLC' as const,
        initiatedDate: '',
        completedDate: '',
        adjudicatedDate: '',
        status: 'Pending' as const,
      },
      dentalClass: '1' as const,
      lastPhysicalDate: new Date().toISOString().split('T')[0],
      nextPhysicalDue: '',
      pulhes: {
        physical: 1 as const,
        upperExtremities: 1 as const,
        lowerExtremities: 1 as const,
        hearing: 1 as const,
        eyes: 1 as const,
        psychiatric: 1 as const,
      },
      visionCategory: '1' as const,
      hearingCategory: 'H1' as const,
      hivStatus: 'Negative' as const,
      lastHivTest: new Date().toISOString().split('T')[0],
      dnaOnFile: false,
      currentMedications: [],
      medicalLimitations: [],
      lastMentalHealthScreen: new Date().toISOString().split('T')[0],
      mentalHealthStatus: 'Green' as const,
      substanceAbuseClear: true,
      pregnancyStatus: 'N/A' as const,
      upcomingAppointments: [],
      basicTrainingDate: '',
      aitDate: '',
      aitMos: formData.mos || '',
      lastPtTestDate: new Date().toISOString().split('T')[0],
      ptPushups: 0,
      ptSitups: 0,
      ptRunTime: '',
      lastWeaponsQualDate: new Date().toISOString().split('T')[0],
      schoolsAttended: [],
      totalTrainingHours: 0,
      annualTrainingComplete: false,
      annualTrainingDate: '',
    } as Omit<Personnel, 'id'>;

    addPersonnel(completeData);

    setFormData(initialFormState);
    setActiveTab('personal');
    setError(null);
    setOpen(false);
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setActiveTab('personal');
    setError(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-2 gradient-primary border-0">
          <Plus className="h-4 w-4" />
          Add Personnel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Personnel</DialogTitle>
          <DialogDescription>
            Enter the details for the new service member.
          </DialogDescription>
          {error && (
            <p className="text-sm text-destructive mt-2">{error}</p>
          )}
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="service">Service</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] mt-4 pr-4">
            <TabsContent value="personal" className="space-y-4 mt-0">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    value={formData.middleName}
                    onChange={(e) => updateField('middleName', e.target.value)}
                    placeholder="Michael"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    placeholder="Smith"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(v) => updateField('gender', v as Personnel['gender'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Blood Type</Label>
                  <Select
                    value={formData.bloodType}
                    onValueChange={(v) => updateField('bloodType', v as Personnel['bloodType'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bt) => (
                        <SelectItem key={bt} value={bt}>{bt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Marital Status</Label>
                  <Select
                    value={formData.maritalStatus}
                    onValueChange={(v) => updateField('maritalStatus', v as Personnel['maritalStatus'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dependents">Dependents</Label>
                  <Input
                    id="dependents"
                    type="number"
                    min="0"
                    value={formData.dependents}
                    onChange={(e) => updateField('dependents', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="religion">Religion</Label>
                  <Input
                    id="religion"
                    value={formData.religion}
                    onChange={(e) => updateField('religion', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Military Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="john.smith@mail.mil"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="personalEmail">Personal Email</Label>
                  <Input
                    id="personalEmail"
                    type="email"
                    value={formData.personalEmail}
                    onChange={(e) => updateField('personalEmail', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input
                  id="streetAddress"
                  value={formData.streetAddress}
                  onChange={(e) => updateField('streetAddress', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateField('state', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => updateField('zipCode', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => updateField('emergencyContact', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) => updateField('emergencyPhone', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="service" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Branch *</Label>
                  <Select
                    value={formData.branch}
                    onValueChange={(v) => updateField('branch', v as Personnel['branch'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Army">Army</SelectItem>
                      <SelectItem value="Navy">Navy</SelectItem>
                      <SelectItem value="Air Force">Air Force</SelectItem>
                      <SelectItem value="Marines">Marines</SelectItem>
                      <SelectItem value="Space Force">Space Force</SelectItem>
                      <SelectItem value="Coast Guard">Coast Guard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.activeStatus}
                    onValueChange={(v) => updateField('activeStatus', v as Personnel['activeStatus'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Reserve">Reserve</SelectItem>
                      <SelectItem value="Guard">Guard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rank">Rank *</Label>
                  <Input
                    id="rank"
                    value={formData.rank}
                    onChange={(e) => updateField('rank', e.target.value)}
                    placeholder="SGT"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payGrade">Pay Grade</Label>
                  <Input
                    id="payGrade"
                    value={formData.payGrade}
                    onChange={(e) => updateField('payGrade', e.target.value)}
                    placeholder="E-5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mos">MOS/Rate</Label>
                  <Input
                    id="mos"
                    value={formData.mos}
                    onChange={(e) => updateField('mos', e.target.value)}
                    placeholder="11B"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dutyStation">Duty Station</Label>
                  <Input
                    id="dutyStation"
                    value={formData.dutyStation}
                    onChange={(e) => updateField('dutyStation', e.target.value)}
                    placeholder="Fort Bragg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => updateField('unit', e.target.value)}
                    placeholder="3rd Infantry Division"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="enlistmentDate">Enlistment Date</Label>
                  <Input
                    id="enlistmentDate"
                    type="date"
                    value={formData.enlistmentDate}
                    onChange={(e) => updateField('enlistmentDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsOfService">Years of Service</Label>
                  <Input
                    id="yearsOfService"
                    type="number"
                    min="0"
                    value={formData.yearsOfService}
                    onChange={(e) => updateField('yearsOfService', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="commandingOfficer">Commanding Officer</Label>
                <Input
                  id="commandingOfficer"
                  value={formData.commandingOfficer}
                  onChange={(e) => updateField('commandingOfficer', e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Clearance Level</Label>
                  <Select
                    value={formData.clearanceLevel}
                    onValueChange={(v) => updateField('clearanceLevel', v as Personnel['clearanceLevel'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Confidential">Confidential</SelectItem>
                      <SelectItem value="Secret">Secret</SelectItem>
                      <SelectItem value="Top Secret">Top Secret</SelectItem>
                      <SelectItem value="TS-SCI">TS-SCI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Access Status</Label>
                  <Select
                    value={formData.accessStatus}
                    onValueChange={(v) => updateField('accessStatus', v as Personnel['accessStatus'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                      <SelectItem value="Revoked">Revoked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clearanceDate">Clearance Date</Label>
                  <Input
                    id="clearanceDate"
                    type="date"
                    value={formData.clearanceDate}
                    onChange={(e) => updateField('clearanceDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clearanceExpiry">Clearance Expiry</Label>
                  <Input
                    id="clearanceExpiry"
                    type="date"
                    value={formData.clearanceExpiry}
                    onChange={(e) => updateField('clearanceExpiry', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="nda"
                  checked={formData.nda}
                  onCheckedChange={(checked) => updateField('nda', !!checked)}
                />
                <Label htmlFor="nda">NDA Signed</Label>
              </div>
            </TabsContent>

            <TabsContent value="medical" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Medical Readiness</Label>
                  <Select
                    value={formData.medicalReadiness}
                    onValueChange={(v) => updateField('medicalReadiness', v as Personnel['medicalReadiness'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Green">Green</SelectItem>
                      <SelectItem value="Yellow">Yellow</SelectItem>
                      <SelectItem value="Red">Red</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Dental Readiness</Label>
                  <Select
                    value={formData.dentalReadiness}
                    onValueChange={(v) => updateField('dentalReadiness', v as Personnel['dentalReadiness'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Green">Green</SelectItem>
                      <SelectItem value="Yellow">Yellow</SelectItem>
                      <SelectItem value="Red">Red</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Profile Status</Label>
                  <Select
                    value={formData.profileStatus}
                    onValueChange={(v) => updateField('profileStatus', v as Personnel['profileStatus'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fit">Fit</SelectItem>
                      <SelectItem value="Limited">Limited</SelectItem>
                      <SelectItem value="Non-deployable">Non-deployable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Checkbox
                    id="deploymentEligible"
                    checked={formData.deploymentEligible}
                    onCheckedChange={(checked) => updateField('deploymentEligible', !!checked)}
                  />
                  <Label htmlFor="deploymentEligible">Deployment Eligible</Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Weapons Qualification</Label>
                  <Select
                    value={formData.weaponsQualification}
                    onValueChange={(v) => updateField('weaponsQualification', v as Personnel['weaponsQualification'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Marksman">Marksman</SelectItem>
                      <SelectItem value="Sharpshooter">Sharpshooter</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ptTestScore">PT Test Score</Label>
                  <Input
                    id="ptTestScore"
                    type="number"
                    min="0"
                    max="300"
                    value={formData.ptTestScore}
                    onChange={(e) => updateField('ptTestScore', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="basicTrainingComplete"
                    checked={formData.basicTrainingComplete}
                    onCheckedChange={(checked) => updateField('basicTrainingComplete', !!checked)}
                  />
                  <Label htmlFor="basicTrainingComplete">Basic Training Complete</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="aitComplete"
                    checked={formData.aitComplete}
                    onCheckedChange={(checked) => updateField('aitComplete', !!checked)}
                  />
                  <Label htmlFor="aitComplete">AIT Complete</Label>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter>
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add Personnel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
