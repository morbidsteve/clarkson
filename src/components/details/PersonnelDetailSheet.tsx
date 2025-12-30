'use client';

import { useSelectionStore } from '@/lib/stores/selection-store';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { RankInsignia } from '@/components/org/RankInsignia';
import {
  User, Mail, Phone, MapPin, Shield, Heart, GraduationCap,
  Calendar, Building2, Award, AlertTriangle, CheckCircle, XCircle
} from 'lucide-react';

function DetailSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        <Icon className="h-4 w-4" />
        {title}
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

function DetailRow({ label, value, badge }: { label: string; value: string | number | boolean | undefined; badge?: 'success' | 'warning' | 'destructive' }) {
  if (value === undefined || value === '') return null;

  const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;

  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      {badge ? (
        <Badge variant={badge === 'success' ? 'default' : badge === 'warning' ? 'secondary' : 'destructive'} className={
          badge === 'success' ? 'bg-green-600' : badge === 'warning' ? 'bg-yellow-600' : ''
        }>
          {displayValue}
        </Badge>
      ) : (
        <span className="text-sm font-medium">{displayValue}</span>
      )}
    </div>
  );
}

function ReadinessIndicator({ status }: { status: string }) {
  const getColor = (s: string) => {
    switch (s) {
      case 'Green': return 'text-green-500';
      case 'Yellow': return 'text-yellow-500';
      case 'Red': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const Icon = status === 'Green' ? CheckCircle : status === 'Red' ? XCircle : AlertTriangle;

  return (
    <div className={`flex items-center gap-1 ${getColor(status)}`}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{status}</span>
    </div>
  );
}

export function PersonnelDetailSheet() {
  const { selectedPerson, isPersonnelDetailOpen, closeDetail } = useSelectionStore();

  if (!selectedPerson) return null;

  const person = selectedPerson;

  return (
    <Sheet open={isPersonnelDetailOpen} onOpenChange={(open) => !open && closeDetail()}>
      <SheetContent className="w-full sm:max-w-xl overflow-hidden">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-4">
            <RankInsignia rank={person.rank} size="lg" />
            <div>
              <SheetTitle className="text-xl">
                {person.rank} {person.lastName}, {person.firstName}
              </SheetTitle>
              <p className="text-sm text-muted-foreground">{person.mos}</p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-140px)] pr-4">
          <div className="space-y-6">
            {/* Service Information */}
            <DetailSection title="Service Information" icon={Building2}>
              <DetailRow label="Pay Grade" value={person.payGrade} />
              <DetailRow label="Branch" value={person.branch} />
              <DetailRow label="Status" value={person.activeStatus} />
              <DetailRow label="Unit" value={person.unit} />
              <DetailRow label="Duty Station" value={person.dutyStation} />
              <DetailRow label="Years of Service" value={person.yearsOfService} />
              <DetailRow label="Commanding Officer" value={person.commandingOfficer} />
              <DetailRow label="Enlistment Date" value={person.enlistmentDate} />
              <DetailRow label="ETS Date" value={person.estimatedTerminationDate} />
            </DetailSection>

            <Separator />

            {/* Personal Information */}
            <DetailSection title="Personal Information" icon={User}>
              <DetailRow label="Full Name" value={`${person.firstName} ${person.middleName} ${person.lastName}`} />
              <DetailRow label="Date of Birth" value={person.dateOfBirth} />
              <DetailRow label="Gender" value={person.gender} />
              <DetailRow label="Marital Status" value={person.maritalStatus} />
              <DetailRow label="Dependents" value={person.dependents} />
              <DetailRow label="Blood Type" value={person.bloodType} />
              <DetailRow label="Religion" value={person.religion} />
            </DetailSection>

            <Separator />

            {/* Contact Information */}
            <DetailSection title="Contact Information" icon={Mail}>
              <DetailRow label="Military Email" value={person.email} />
              <DetailRow label="Personal Email" value={person.personalEmail} />
              <DetailRow label="Phone" value={person.phone} />
              <DetailRow label="Address" value={`${person.streetAddress}, ${person.city}, ${person.state} ${person.zipCode}`} />
              <DetailRow label="Emergency Contact" value={person.emergencyContact} />
              <DetailRow label="Emergency Phone" value={person.emergencyPhone} />
            </DetailSection>

            <Separator />

            {/* Security Clearance */}
            <DetailSection title="Security Clearance" icon={Shield}>
              <DetailRow label="Clearance Level" value={person.clearanceLevel} badge={
                person.clearanceLevel === 'TS-SCI' ? 'success' :
                person.clearanceLevel === 'Top Secret' ? 'success' :
                person.clearanceLevel === 'Secret' ? 'warning' : undefined
              } />
              <DetailRow label="Clearance Date" value={person.clearanceDate} />
              <DetailRow label="Expiry Date" value={person.clearanceExpiry} />
              <DetailRow label="Access Status" value={person.accessStatus} />
              <DetailRow label="Polygraph Type" value={person.polygraphType} />
              <DetailRow label="Polygraph Date" value={person.polygraphDate} />
              <DetailRow label="Last Investigation" value={person.lastInvestigation?.type} />
              <DetailRow label="NDA Signed" value={person.nda} />
              <DetailRow label="Foreign Contacts" value={person.foreignContacts} />
              <DetailRow label="Security Incidents" value={person.securityIncidents} />
              {person.specialAccess.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {person.specialAccess.map((program) => (
                    <Badge key={program} variant="outline" className="text-xs">
                      {program}
                    </Badge>
                  ))}
                </div>
              )}
            </DetailSection>

            <Separator />

            {/* Medical & Readiness */}
            <DetailSection title="Medical & Readiness" icon={Heart}>
              <div className="grid grid-cols-2 gap-4 py-2">
                <div>
                  <span className="text-xs text-muted-foreground">Medical</span>
                  <ReadinessIndicator status={person.medicalReadiness} />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Dental</span>
                  <ReadinessIndicator status={person.dentalReadiness} />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Mental Health</span>
                  <ReadinessIndicator status={person.mentalHealthStatus} />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Deployment</span>
                  <ReadinessIndicator status={person.deploymentEligible ? 'Green' : 'Red'} />
                </div>
              </div>
              <DetailRow label="Profile Status" value={person.profileStatus} badge={
                person.profileStatus === 'Fit' ? 'success' :
                person.profileStatus === 'Limited' ? 'warning' : 'destructive'
              } />
              <DetailRow label="Last Physical" value={person.lastPhysicalDate} />
              <DetailRow label="Next Physical Due" value={person.nextPhysicalDue} />
              <DetailRow label="Dental Class" value={person.dentalClass} />
              <DetailRow label="Vision Category" value={person.visionCategory} />
              <DetailRow label="Hearing Category" value={person.hearingCategory} />
              {person.allergies.length > 0 && (
                <div className="pt-2">
                  <span className="text-sm text-muted-foreground">Allergies:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {person.allergies.map((allergy) => (
                      <Badge key={allergy} variant="outline" className="text-xs bg-red-500/10">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </DetailSection>

            <Separator />

            {/* Training & Qualifications */}
            <DetailSection title="Training & Qualifications" icon={GraduationCap}>
              <DetailRow label="Basic Training" value={person.basicTrainingComplete ? 'Complete' : 'Incomplete'} />
              <DetailRow label="Basic Training Date" value={person.basicTrainingDate} />
              <DetailRow label="AIT Complete" value={person.aitComplete} />
              <DetailRow label="AIT MOS" value={person.aitMos} />
              <DetailRow label="PT Score" value={person.ptTestScore} />
              <DetailRow label="Last PT Test" value={person.lastPtTestDate} />
              <DetailRow label="Run Time" value={person.ptRunTime} />
              <DetailRow label="Push-ups" value={person.ptPushups} />
              <DetailRow label="Sit-ups" value={person.ptSitups} />
              <DetailRow label="Weapons Qual" value={person.weaponsQualification} badge={
                person.weaponsQualification === 'Expert' ? 'success' :
                person.weaponsQualification === 'Sharpshooter' ? 'warning' : undefined
              } />
              <DetailRow label="Total Training Hours" value={person.totalTrainingHours} />
              <DetailRow label="Annual Training" value={person.annualTrainingComplete ? 'Complete' : 'Pending'} />
              {person.specialSkills.length > 0 && (
                <div className="pt-2">
                  <span className="text-sm text-muted-foreground">Special Skills:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {person.specialSkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {person.certifications.length > 0 && (
                <div className="pt-2">
                  <span className="text-sm text-muted-foreground">Certifications:</span>
                  <div className="space-y-1 mt-1">
                    {person.certifications.map((cert, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span>{cert.name}</span>
                        <Badge variant={cert.status === 'Current' ? 'default' : 'secondary'} className="text-xs">
                          {cert.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </DetailSection>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
