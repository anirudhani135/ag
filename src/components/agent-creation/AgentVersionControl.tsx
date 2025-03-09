
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Clock, Save, Tag, GitBranch } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Version {
  id: string;
  versionNumber: string;
  createdAt: string;
  changes: string;
  status: "draft" | "published" | "archived";
}

interface AgentVersionControlProps {
  agentId: string;
  currentVersion: string;
  onVersionChange: (version: string) => void;
}

export const AgentVersionControl = ({ 
  agentId, 
  currentVersion, 
  onVersionChange 
}: AgentVersionControlProps) => {
  const { toast } = useToast();
  const [newVersionOpen, setNewVersionOpen] = useState(false);
  const [newVersionNumber, setNewVersionNumber] = useState("");
  const [changeNotes, setChangeNotes] = useState("");
  
  // Mock version history for demonstration
  const [versions, setVersions] = useState<Version[]>([
    {
      id: "1",
      versionNumber: "1.0.0",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      changes: "Initial release",
      status: "published"
    }
  ]);

  const handleCreateVersion = () => {
    if (!newVersionNumber.trim()) {
      toast({
        title: "Version number required",
        description: "Please enter a valid version number",
        variant: "destructive",
      });
      return;
    }

    const newVersion: Version = {
      id: crypto.randomUUID(),
      versionNumber: newVersionNumber,
      createdAt: new Date().toISOString(),
      changes: changeNotes,
      status: "draft"
    };

    setVersions([...versions, newVersion]);
    onVersionChange(newVersionNumber);
    
    toast({
      title: "New version created",
      description: `Version ${newVersionNumber} has been created`,
    });
    
    setNewVersionOpen(false);
    setNewVersionNumber("");
    setChangeNotes("");
  };

  const handleSelectVersion = (version: Version) => {
    onVersionChange(version.versionNumber);
    
    toast({
      title: "Version changed",
      description: `Switched to version ${version.versionNumber}`,
    });
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            Version Control
          </CardTitle>
          <Dialog open={newVersionOpen} onOpenChange={setNewVersionOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Tag className="h-4 w-4 mr-1" />
                New Version
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Version</DialogTitle>
                <DialogDescription>
                  Create a new version of your agent with updated configuration
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="version-number">Version Number</Label>
                  <Input
                    id="version-number"
                    placeholder="e.g. 1.1.0"
                    value={newVersionNumber}
                    onChange={(e) => setNewVersionNumber(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="change-notes">Change Notes</Label>
                  <Textarea
                    id="change-notes"
                    placeholder="Describe the changes in this version"
                    value={changeNotes}
                    onChange={(e) => setChangeNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewVersionOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateVersion}>
                  Create Version
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Current Version</h4>
            <Badge variant="outline" className="font-mono">
              {currentVersion}
            </Badge>
          </div>
          
          <div className="space-y-1 mt-4">
            <h4 className="text-sm font-medium">Version History</h4>
            <div className="border rounded-md divide-y">
              {versions.map((version) => (
                <div 
                  key={version.id} 
                  className={`p-3 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer ${
                    version.versionNumber === currentVersion ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleSelectVersion(version)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">{version.versionNumber}</span>
                      {version.status === "published" && (
                        <Badge variant="outline" className="text-green-600 bg-green-50 text-xs">
                          Published
                        </Badge>
                      )}
                      {version.status === "draft" && (
                        <Badge variant="outline" className="text-amber-600 bg-amber-50 text-xs">
                          Draft
                        </Badge>
                      )}
                    </div>
                    {version.changes && (
                      <p className="text-xs text-gray-500 line-clamp-1">{version.changes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {new Date(version.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
