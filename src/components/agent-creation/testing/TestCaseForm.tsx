
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Play, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { TestCase } from "@/types/agent-creation";
import { useToast } from "@/components/ui/use-toast";

interface TestCaseFormProps {
  testCases: TestCase[];
  onSave: (testCases: TestCase[]) => void;
  runningEnabled?: boolean;
}

export const TestCaseForm = ({ testCases, onSave, runningEnabled = false }: TestCaseFormProps) => {
  const { toast } = useToast();
  const [localTestCases, setLocalTestCases] = useState<TestCase[]>(testCases);
  const [runningTestIndex, setRunningTestIndex] = useState<number | null>(null);

  const addTestCase = () => {
    const newTestCase: TestCase = {
      id: crypto.randomUUID(),
      name: `Test Case ${localTestCases.length + 1}`,
      input: "",
      expectedOutput: "",
    };
    setLocalTestCases([...localTestCases, newTestCase]);
  };

  const removeTestCase = (index: number) => {
    const updatedTestCases = [...localTestCases];
    updatedTestCases.splice(index, 1);
    setLocalTestCases(updatedTestCases);
  };

  const updateTestCase = (index: number, field: keyof TestCase, value: string) => {
    const updatedTestCases = [...localTestCases];
    updatedTestCases[index] = {
      ...updatedTestCases[index],
      [field]: value,
    };
    setLocalTestCases(updatedTestCases);
  };

  const handleSave = () => {
    onSave(localTestCases);
    toast({
      title: "Test cases saved",
      description: `Saved ${localTestCases.length} test cases`,
    });
  };

  const runTest = async (index: number) => {
    if (!runningEnabled) {
      toast({
        title: "Test execution not available",
        description: "Test execution will be available after deployment",
        variant: "destructive",
      });
      return;
    }

    setRunningTestIndex(index);
    const testCase = localTestCases[index];

    // Mock API call to run the test
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result
      const success = Math.random() > 0.3; // 70% chance of success for demo
      const result = success 
        ? "This is a sample successful response that matches expectations."
        : "Error: Unable to process this request correctly.";
      
      const updatedTestCases = [...localTestCases];
      updatedTestCases[index] = {
        ...updatedTestCases[index],
        actualOutput: result,
        status: success ? "success" : "failure",
      };
      
      setLocalTestCases(updatedTestCases);
      
      toast({
        title: success ? "Test passed" : "Test failed",
        description: success 
          ? "The test case executed successfully"
          : "The test case failed to match expected output",
        variant: success ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Error running test",
        description: "An error occurred while running the test",
        variant: "destructive",
      });
    } finally {
      setRunningTestIndex(null);
    }
  };

  const runAllTests = async () => {
    if (!runningEnabled) {
      toast({
        title: "Test execution not available",
        description: "Test execution will be available after deployment",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Running all tests",
      description: `Executing ${localTestCases.length} test cases`,
    });
    
    for (let i = 0; i < localTestCases.length; i++) {
      await runTest(i);
      // Add a small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Test Cases</CardTitle>
          <div className="flex gap-2">
            {runningEnabled && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={runAllTests}
                className="text-xs"
              >
                <Play className="h-3.5 w-3.5 mr-1" />
                Run All
              </Button>
            )}
            <Button 
              variant="default" 
              size="sm" 
              onClick={addTestCase}
              className="text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Test Case
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {localTestCases.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No test cases added yet</p>
            <Button onClick={addTestCase} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Test Case
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {localTestCases.map((testCase, index) => (
              <div 
                key={testCase.id} 
                className={`p-4 border rounded-lg relative ${
                  testCase.status === "success" 
                    ? "border-green-200 bg-green-50" 
                    : testCase.status === "failure" 
                      ? "border-red-200 bg-red-50" 
                      : "border-gray-200"
                }`}
              >
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  {testCase.status === "success" && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {testCase.status === "failure" && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  {runningEnabled && (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => runTest(index)}
                      disabled={runningTestIndex !== null}
                    >
                      {runningTestIndex === index ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Play className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-6 w-6 text-red-500 hover:bg-red-50"
                    onClick={() => removeTestCase(index)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                
                <div className="grid gap-4 mb-2">
                  <div>
                    <Label htmlFor={`test-name-${index}`}>Test Name</Label>
                    <Input
                      id={`test-name-${index}`}
                      value={testCase.name}
                      onChange={(e) => updateTestCase(index, "name", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`test-input-${index}`}>Input</Label>
                    <Textarea
                      id={`test-input-${index}`}
                      value={testCase.input}
                      onChange={(e) => updateTestCase(index, "input", e.target.value)}
                      rows={3}
                      className="resize-none mt-1"
                      placeholder="Enter the test input here..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`test-expected-${index}`}>Expected Output</Label>
                    <Textarea
                      id={`test-expected-${index}`}
                      value={testCase.expectedOutput || ""}
                      onChange={(e) => updateTestCase(index, "expectedOutput", e.target.value)}
                      rows={3}
                      className="resize-none mt-1"
                      placeholder="Enter the expected output here..."
                    />
                  </div>
                  
                  {testCase.actualOutput && (
                    <div>
                      <Label htmlFor={`test-actual-${index}`} className="flex items-center gap-2">
                        Actual Output
                        {testCase.status === "success" ? (
                          <span className="text-xs text-green-500 font-normal">(Test Passed)</span>
                        ) : (
                          <span className="text-xs text-red-500 font-normal">(Test Failed)</span>
                        )}
                      </Label>
                      <Textarea
                        id={`test-actual-${index}`}
                        value={testCase.actualOutput}
                        readOnly
                        rows={3}
                        className={`resize-none mt-1 font-mono text-sm ${
                          testCase.status === "success" 
                            ? "border-green-200 bg-green-50" 
                            : "border-red-200 bg-red-50"
                        }`}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={addTestCase}
                className="text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Another Test Case
              </Button>
              
              <Button onClick={handleSave}>
                Save Test Cases
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
