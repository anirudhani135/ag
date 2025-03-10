
import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayIcon, Plus, Save, Trash2, CheckCircle, XCircle, MessageSquare, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { TestCase } from "@/types/agent-creation";

interface TestingStepProps {
  onSave: (testCases: TestCase[]) => void;
  initialTestCases?: TestCase[];
}

export const TestingStep = ({ onSave, initialTestCases = [] }: TestingStepProps) => {
  const [activeTab, setActiveTab] = useState("interactive");
  const [testCases, setTestCases] = useState<TestCase[]>(initialTestCases.length ? initialTestCases : [
    { id: crypto.randomUUID(), name: "Test Case 1", input: "Hello, how are you?", expectedOutput: "" }
  ]);
  const [selectedTestCase, setSelectedTestCase] = useState<string>(initialTestCases[0]?.id || testCases[0].id);
  const [interactiveInput, setInteractiveInput] = useState("");
  const [interactiveHistory, setInteractiveHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [isRunningAllTests, setIsRunningAllTests] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const addNewTestCase = () => {
    const newTestCase: TestCase = {
      id: crypto.randomUUID(),
      name: `Test Case ${testCases.length + 1}`,
      input: "",
      expectedOutput: "",
    };
    setTestCases([...testCases, newTestCase]);
    setSelectedTestCase(newTestCase.id);
    
    toast({
      title: "Test case added",
      description: `New test case "${newTestCase.name}" has been created.`,
    });
  };

  const updateTestCase = useCallback((id: string, updates: Partial<TestCase>) => {
    setTestCases(testCases.map(tc => tc.id === id ? { ...tc, ...updates } : tc));
  }, [testCases]);

  const deleteTestCase = (id: string) => {
    if (testCases.length <= 1) {
      toast({
        title: "Cannot delete",
        description: "You must have at least one test case.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedTestCases = testCases.filter(tc => tc.id !== id);
    setTestCases(updatedTestCases);
    
    if (selectedTestCase === id) {
      setSelectedTestCase(updatedTestCases[0].id);
    }
    
    toast({
      title: "Test case deleted",
      description: "The test case has been removed.",
      variant: "default",
    });
  };

  const runTestCase = (id: string) => {
    setIsRunningTest(true);
    const testCase = testCases.find(tc => tc.id === id);
    
    if (!testCase) return;
    
    // Simulate test execution
    setTimeout(() => {
      const mockOutput = `I'm doing well, thank you for asking! How can I assist you today?`;
      const success = !testCase.expectedOutput || testCase.expectedOutput.trim() === "" || 
                     mockOutput.includes(testCase.expectedOutput);
      
      updateTestCase(id, {
        actualOutput: mockOutput,
        status: success ? "success" : "failure"
      });
      
      setIsRunningTest(false);
      
      toast({
        title: success ? "Test passed" : "Test failed",
        description: success ? "The test case executed successfully." : "The test output didn't match expectations.",
        variant: success ? "default" : "destructive",
      });
    }, 1500);
  };

  const runAllTests = () => {
    setIsRunningAllTests(true);
    setProgress(0);
    
    // Simulate running all tests sequentially
    let count = 0;
    const totalTests = testCases.length;
    
    const timer = setInterval(() => {
      if (count >= totalTests) {
        clearInterval(timer);
        setIsRunningAllTests(false);
        setProgress(100);
        
        const failedTests = testCases.filter(tc => tc.status === "failure").length;
        toast({
          title: failedTests === 0 ? "All tests passed" : `${failedTests} tests failed`,
          description: failedTests === 0 
            ? "All test cases executed successfully." 
            : `${totalTests - failedTests}/${totalTests} tests passed.`,
          variant: failedTests === 0 ? "default" : "destructive",
        });
        return;
      }
      
      const testCase = testCases[count];
      const mockOutput = `I'm doing well, thank you for asking! How can I assist you today?`;
      const success = !testCase.expectedOutput || testCase.expectedOutput.trim() === "" || 
                     mockOutput.includes(testCase.expectedOutput);
      
      updateTestCase(testCase.id, {
        actualOutput: mockOutput,
        status: success ? "success" : "failure"
      });
      
      count++;
      setProgress(Math.round((count / totalTests) * 100));
    }, 500);
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      onSave(testCases);
      setIsSaving(false);
      toast({
        title: "Test cases saved",
        description: `${testCases.length} test cases have been saved.`,
      });
    }, 800);
  };

  const sendInteractiveMessage = () => {
    if (!interactiveInput.trim()) return;
    
    // Add user message to history
    setInteractiveHistory([...interactiveHistory, { role: "user", content: interactiveInput }]);
    const userInput = interactiveInput;
    setInteractiveInput("");
    
    // Simulate agent response
    setTimeout(() => {
      setInteractiveHistory(prev => [
        ...prev, 
        { 
          role: "assistant", 
          content: `I'm a simulated agent response to "${userInput}". In a real deployment, this would be the actual agent's response.` 
        }
      ]);
    }, 1000);
  };

  const handleInteractiveKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendInteractiveMessage();
    }
  };

  const selectedTestCaseData = testCases.find(tc => tc.id === selectedTestCase);

  return (
    <Card className="bg-white shadow-lg rounded-xl overflow-hidden border-0">
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Test Your Agent</h3>
          <p className="text-muted-foreground">
            Verify your agent's behavior before deployment.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 gap-4 bg-muted/30 p-1 mb-4">
            <TabsTrigger value="testcases" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Test Cases
            </TabsTrigger>
            <TabsTrigger value="interactive" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Interactive Testing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="testcases" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-4 md:col-span-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Test Cases</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addNewTestCase}
                    className="h-8 px-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <ScrollArea className="h-[300px] border rounded-md p-2">
                  <div className="space-y-2">
                    {testCases.map((tc) => (
                      <div
                        key={tc.id}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                          tc.id === selectedTestCase
                            ? "bg-blue-50 text-blue-600 border border-blue-200"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedTestCase(tc.id)}
                      >
                        <div className="flex items-center">
                          {tc.status === "success" && (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          )}
                          {tc.status === "failure" && (
                            <XCircle className="h-4 w-4 text-red-500 mr-2" />
                          )}
                          <span className="truncate max-w-[120px]">{tc.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTestCase(tc.id);
                          }}
                          className="h-6 w-6 p-0 opacity-50 hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={runAllTests}
                    disabled={isRunningAllTests}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                  >
                    {isRunningAllTests ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Running Tests...
                      </>
                    ) : (
                      "Run All Tests"
                    )}
                  </Button>
                  {isRunningAllTests && (
                    <div className="space-y-1">
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-center text-muted-foreground">{progress}% complete</p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save All Tests
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4 md:col-span-3">
                {selectedTestCaseData && (
                  <>
                    <div className="space-y-3">
                      <Label htmlFor="testName">Test Name</Label>
                      <Input
                        id="testName"
                        value={selectedTestCaseData.name}
                        onChange={(e) =>
                          updateTestCase(selectedTestCase, { name: e.target.value })
                        }
                        className="w-full focus:ring-2 focus:ring-blue-500 transition-shadow"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="testInput">Input</Label>
                      <Textarea
                        id="testInput"
                        value={selectedTestCaseData.input}
                        onChange={(e) =>
                          updateTestCase(selectedTestCase, { input: e.target.value })
                        }
                        className="min-h-[80px] focus:ring-2 focus:ring-blue-500 transition-shadow"
                        placeholder="Enter test input..."
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="expectedOutput">Expected Output (Optional)</Label>
                      <Textarea
                        id="expectedOutput"
                        value={selectedTestCaseData.expectedOutput}
                        onChange={(e) =>
                          updateTestCase(selectedTestCase, { expectedOutput: e.target.value })
                        }
                        className="min-h-[80px] focus:ring-2 focus:ring-blue-500 transition-shadow"
                        placeholder="Enter expected output (leave blank for any output)..."
                      />
                      <p className="text-xs text-muted-foreground">
                        Leave blank to accept any response, or enter text that should be included in the response.
                      </p>
                    </div>
                    {selectedTestCaseData.actualOutput && (
                      <div className="space-y-3">
                        <Label htmlFor="actualOutput">Actual Output</Label>
                        <div
                          className={`p-3 rounded-md text-sm ${
                            selectedTestCaseData.status === "success"
                              ? "bg-green-50 border border-green-100"
                              : "bg-red-50 border border-red-100"
                          }`}
                        >
                          {selectedTestCaseData.actualOutput}
                        </div>
                      </div>
                    )}
                    <div className="pt-2">
                      <Button
                        onClick={() => runTestCase(selectedTestCase)}
                        disabled={isRunningTest}
                        className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                      >
                        {isRunningTest ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Running Test...
                          </>
                        ) : (
                          <>
                            <PlayIcon className="h-4 w-4 mr-2" />
                            Run Test
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interactive" className="space-y-6">
            <div className="border rounded-md p-4 h-[400px] flex flex-col">
              <ScrollArea className="flex-1 mb-4 pr-4">
                {interactiveHistory.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-center p-4">
                    <div>
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Start a conversation with your agent to test its responses.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {interactiveHistory.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-2 rounded-lg ${
                            message.role === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100"
                          } transition-all duration-200 animate-fade-in`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              <div className="flex items-center space-x-2">
                <Textarea
                  value={interactiveInput}
                  onChange={(e) => setInteractiveInput(e.target.value)}
                  onKeyDown={handleInteractiveKeyDown}
                  placeholder="Type a message..."
                  className="min-h-[60px] focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
                <Button 
                  onClick={sendInteractiveMessage} 
                  className="h-full px-4 bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                >
                  Send
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Interactive Testing Tips</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Use this mode to have a conversation with your agent</li>
                <li>Test edge cases and specific scenarios</li>
                <li>Try different phrasings of similar questions</li>
                <li>Verify that your agent maintains context across messages</li>
                <li>Save interesting conversations as test cases for future reference</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};
