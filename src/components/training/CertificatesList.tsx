import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Download, Share2, Calendar, BookOpen } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { format } from "date-fns";

interface CertificatesListProps {
  className?: string;
}

const CertificatesList = ({ className }: CertificatesListProps) => {
  const { certificates, loadUserCertificates, loading, error } = useCourses();

  React.useEffect(() => {
    loadUserCertificates();
  }, [loadUserCertificates]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Card
        className={`w-full bg-cvup-blue text-white border-none shadow-lg ${className}`}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Award className="h-5 w-5 text-cvup-gold" /> Loading Certificates...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`w-full border-red-300 shadow-lg ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-red-500">
            Error Loading Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!certificates || certificates.length === 0) {
    return (
      <Card className={`w-full shadow-lg ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Award className="h-5 w-5 text-cvup-gold" /> My Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You haven't earned any certificates yet. Complete courses to earn
            certificates.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full shadow-lg ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Award className="h-5 w-5 text-cvup-gold" /> My Certificates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="p-4 rounded-lg border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-accent/10 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-lg">
                  {certificate.course_title}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Issued on {formatDate(certificate.issue_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>{certificate.course_hours} hours</span>
                </div>
                <Badge className="mt-2 w-fit bg-cvup-gold text-cvup-blue hover:bg-cvup-lightgold">
                  {certificate.course_category}
                </Badge>
              </div>
              <div className="flex gap-2 self-end md:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() =>
                    window.open(`/certificate/${certificate.id}`, "_blank")
                  }
                >
                  <Share2 className="h-4 w-4" /> Share
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-1 bg-cvup-gold text-cvup-blue hover:bg-cvup-lightgold"
                  onClick={() =>
                    window.open(
                      `/certificate/${certificate.id}/download`,
                      "_blank",
                    )
                  }
                >
                  <Download className="h-4 w-4" /> Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificatesList;
