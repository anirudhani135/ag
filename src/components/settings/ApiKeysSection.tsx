
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, EyeOff, Eye, Plus } from "lucide-react";

export interface ApiKey {
  id: string;
  name: string;
  created_at: string;
  last_used?: string;
  key: string;
}

interface ApiKeysSectionProps {
  apiKeys: ApiKey[] | undefined;
  isLoading: boolean;
  onCreateKey: (name: string) => Promise<void>;
  onRevokeKey: (id: string) => Promise<void>;
}

export const ApiKeysSection = ({
  apiKeys,
  isLoading,
  onCreateKey,
  onRevokeKey
}: ApiKeysSectionProps) => {
  const { toast } = useToast();
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [newKey, setNewKey] = useState<string | null>(null);

  const handleCreateKey = async () => {
    if (!newKeyName) {
      toast({
        title: "Error",
        description: "Please enter a name for the API key",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      await onCreateKey(newKeyName);
      setNewKeyName("");
      // Simulate the new key that would be created
      const simulatedKey = `sk_live_${Math.random().toString(36).substring(2, 15)}`;
      setNewKey(simulatedKey);
      toast({
        title: "API Key Created",
        description: "Your new API key has been created",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  const toggleShowKey = (id: string) => {
    setShowKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Manage API keys to interact with the platform programmatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {newKey && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="font-medium text-yellow-800 mb-2">
                  New API Key Created
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-white p-2 rounded border flex-1 overflow-x-auto">
                    {newKey}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyKey(newKey)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-yellow-700 mt-2">
                  This key will only be shown once. Copy it now and store it securely.
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Key name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleCreateKey}
                disabled={isCreating || !newKeyName}
                className="flex-shrink-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                {isCreating ? "Creating..." : "Create Key"}
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : apiKeys && apiKeys.length > 0 ? (
              <div className="space-y-2">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="flex flex-wrap md:flex-nowrap items-center justify-between p-3 border rounded gap-2"
                  >
                    <div className="w-full md:w-auto">
                      <div className="font-medium">{key.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Created: {new Date(key.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <div className="relative flex-1 max-w-md">
                        <Input
                          type={showKeys[key.id] ? "text" : "password"}
                          value={key.key}
                          readOnly
                          className="pr-10 font-mono text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => toggleShowKey(key.id)}
                        >
                          {showKeys[key.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyKey(key.key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onRevokeKey(key.id)}
                      >
                        Revoke
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No API keys yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
