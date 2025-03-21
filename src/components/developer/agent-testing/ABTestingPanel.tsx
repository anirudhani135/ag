
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Button,
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  Input,
  Slider,
  Switch,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/button";
import { 
  Play, 
  PauseCircle, 
  BarChart4, 
  LineChart, 
  FlaskConical,
  Activity,
  Users,
  LayoutDashboard,
  Settings2,
  Lightbulb,
  FlaskRound,
  CheckCircle2,
  Check,
  Download,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from '@/components/ui/separator';

interface ABTestVersion {
  id: string;
  name: string;
  trafficAllocation: number;
  status: 'active' | 'inactive';
  metrics: {
    conversions: number;
    conversionRate: number;
    avgSessionTime: number;
    engagementRate: number;
    userSatisfaction: number;
    responses: number;
  };
}

interface ABTestingPanelProps {
  agentId: string;
  versions: {
    id: string;
    name: string;
    createdAt: string;
  }[];
}

// Sample data for the charts
const chartData = [
  { day: 'Mon', versionA: 120, versionB: 140, versionC: 110 },
  { day: 'Tue', versionA: 150, versionB: 130, versionC: 140 },
  { day: 'Wed', versionA: 170, versionB: 190, versionC: 160 },
  { day: 'Thu', versionA: 180, versionB: 250, versionC: 200 },
  { day: 'Fri', versionA: 230, versionB: 280, versionC: 210 },
  { day: 'Sat', versionA: 260, versionB: 240, versionC: 220 },
  { day: 'Sun', versionA: 290, versionB: 300, versionC: 250 },
];

const conversionData = [
  { day: 'Mon', versionA: 0.5, versionB: 0.7, versionC: 0.4 },
  { day: 'Tue', versionA: 0.6, versionB: 0.6, versionC: 0.5 },
  { day: 'Wed', versionA: 0.7, versionB: 0.8, versionC: 0.6 },
  { day: 'Thu', versionA: 0.8, versionB: 1.2, versionC: 0.9 },
  { day: 'Fri', versionA: 1.0, versionB: 1.3, versionC: 0.8 },
  { day: 'Sat', versionA: 1.1, versionB: 1.1, versionC: 1.0 },
  { day: 'Sun', versionA: 1.3, versionB: 1.4, versionC: 1.1 },
];

const testVersions: ABTestVersion[] = [
  {
    id: 'v1',
    name: 'Version A (Control)',
    trafficAllocation: 33,
    status: 'active',
    metrics: {
      conversions: 243,
      conversionRate: 3.2,
      avgSessionTime: 125,
      engagementRate: 45.6,
      userSatisfaction: 8.3,
      responses: 1420
    }
  },
  {
    id: 'v2',
    name: 'Version B (Variant)',
    trafficAllocation: 33,
    status: 'active',
    metrics: {
      conversions: 287,
      conversionRate: 3.8,
      avgSessionTime: 142,
      engagementRate: 52.1,
      userSatisfaction: 8.7,
      responses: 1560
    }
  },
  {
    id: 'v3',
    name: 'Version C (Experiment)',
    trafficAllocation: 34,
    status: 'active',
    metrics: {
      conversions: 221,
      conversionRate: 2.9,
      avgSessionTime: 118,
      engagementRate: 43.2,
      userSatisfaction: 7.9,
      responses: 1340
    }
  }
];

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const ABTestingPanel = ({ agentId, versions }: ABTestingPanelProps) => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(true);
  const [testName, setTestName] = useState('Multi-variant Agent Test');
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [testDescription, setTestDescription] = useState('Comparing different agent versions for overall performance and user engagement');
  const [activeVersions, setActiveVersions] = useState<ABTestVersion[]>(testVersions);
  const [confidenceLevel, setConfidenceLevel] = useState(95);
  const [dateRange, setDateRange] = useState('7d');

  // Start or pause test
  const toggleTestStatus = () => {
    setIsRunning(!isRunning);
    
    toast({
      title: isRunning ? "Test paused" : "Test started",
      description: isRunning 
        ? "The A/B test has been paused. No traffic will be distributed between variants." 
        : "The A/B test is now running. Traffic will be distributed according to your settings.",
    });
  };

  // Update traffic allocation
  const updateTrafficAllocation = (id: string, value: number) => {
    const newVersions = activeVersions.map(v => {
      if (v.id === id) {
        return { ...v, trafficAllocation: value };
      }
      return v;
    });
    
    // Adjust other versions' allocation to ensure total is 100%
    const totalOthers = newVersions
      .filter(v => v.id !== id)
      .reduce((sum, v) => sum + v.trafficAllocation, 0);
    
    const remaining = 100 - value;
    
    if (totalOthers > 0) {
      const ratio = remaining / totalOthers;
      
      newVersions.forEach(v => {
        if (v.id !== id) {
          v.trafficAllocation = Math.round(v.trafficAllocation * ratio);
        }
      });
    }
    
    // Ensure total is exactly 100%
    const total = newVersions.reduce((sum, v) => sum + v.trafficAllocation, 0);
    if (total !== 100 && newVersions.length > 0) {
      const diff = 100 - total;
      const lastId = newVersions[newVersions.length - 1].id;
      
      newVersions.forEach(v => {
        if (v.id === lastId && v.id !== id) {
          v.trafficAllocation += diff;
        }
      });
    }
    
    setActiveVersions(newVersions);
  };

  // Toggle version status
  const toggleVersionStatus = (id: string) => {
    setActiveVersions(prevVersions => 
      prevVersions.map(v => 
        v.id === id 
          ? { ...v, status: v.status === 'active' ? 'inactive' : 'active' } 
          : v
      )
    );
  };

  // Add a new version to the test
  const addTestVersion = () => {
    if (activeVersions.length >= 5) {
      toast({
        title: "Maximum versions reached",
        description: "You can test up to 5 versions simultaneously.",
        variant: "destructive",
      });
      return;
    }
    
    const newId = `v${activeVersions.length + 1}`;
    const newName = `Version ${String.fromCharCode(65 + activeVersions.length)} (New)`;
    
    // Calculate new traffic allocation
    const newAllocation = Math.floor(100 / (activeVersions.length + 1));
    const newVersions = activeVersions.map(v => ({
      ...v,
      trafficAllocation: newAllocation
    }));
    
    // Add new version
    newVersions.push({
      id: newId,
      name: newName,
      trafficAllocation: 100 - (newAllocation * activeVersions.length),
      status: 'inactive',
      metrics: {
        conversions: 0,
        conversionRate: 0,
        avgSessionTime: 0,
        engagementRate: 0,
        userSatisfaction: 0,
        responses: 0
      }
    });
    
    setActiveVersions(newVersions);
    
    toast({
      title: "New version added",
      description: `${newName} has been added to the test. Configure it before activating.`,
    });
  };

  // Remove a version from the test
  const removeVersion = (id: string) => {
    if (activeVersions.length <= 2) {
      toast({
        title: "Minimum versions required",
        description: "You need at least 2 versions for A/B testing.",
        variant: "destructive",
      });
      return;
    }
    
    const versionToRemove = activeVersions.find(v => v.id === id);
    if (!versionToRemove) return;
    
    const allocationToRedistribute = versionToRemove.trafficAllocation;
    const remainingVersions = activeVersions.filter(v => v.id !== id);
    
    // Redistribute traffic allocation
    const totalRemainingAllocation = remainingVersions.reduce((sum, v) => sum + v.trafficAllocation, 0);
    
    const newVersions = remainingVersions.map(v => {
      const newAllocation = Math.round(v.trafficAllocation + (allocationToRedistribute * (v.trafficAllocation / totalRemainingAllocation)));
      return { ...v, trafficAllocation: newAllocation };
    });
    
    // Ensure total is exactly 100%
    const total = newVersions.reduce((sum, v) => sum + v.trafficAllocation, 0);
    if (total !== 100 && newVersions.length > 0) {
      const diff = 100 - total;
      newVersions[0].trafficAllocation += diff;
    }
    
    setActiveVersions(newVersions);
    
    toast({
      title: "Version removed",
      description: `${versionToRemove.name} has been removed from the test.`,
    });
  };

  // Get the winner version based on conversion rate
  const getWinnerVersion = () => {
    const activeOnes = activeVersions.filter(v => v.status === 'active');
    if (activeOnes.length <= 1) return null;
    
    return activeOnes.reduce((prev, current) => 
      prev.metrics.conversionRate > current.metrics.conversionRate ? prev : current
    );
  };

  // Get status badge styling
  const getStatusBadge = (status: 'active' | 'inactive') => {
    return status === 'active' 
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  // Get performance comparison
  const getPerformanceComparison = (version: ABTestVersion) => {
    const controlVersion = activeVersions.find(v => v.id === 'v1');
    if (!controlVersion || version.id === 'v1') return null;
    
    const conversionDiff = ((version.metrics.conversionRate - controlVersion.metrics.conversionRate) / controlVersion.metrics.conversionRate) * 100;
    
    return {
      value: conversionDiff.toFixed(1),
      positive: conversionDiff > 0
    };
  };

  const winner = getWinnerVersion();

  return (
    <div className="space-y-6">
      <Card className="hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-blue-500" />
              <CardTitle>A/B Testing</CardTitle>
              <Badge 
                variant={isRunning ? "default" : "outline"}
                className={isRunning ? "bg-green-500 hover:bg-green-600" : ""}
              >
                {isRunning ? "Running" : "Paused"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[130px] h-8">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant={isRunning ? "destructive" : "default"} 
                size="sm"
                onClick={toggleTestStatus}
              >
                {isRunning ? (
                  <>
                    <PauseCircle className="mr-1 h-4 w-4" />
                    Pause Test
                  </>
                ) : (
                  <>
                    <Play className="mr-1 h-4 w-4" />
                    Start Test
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <div className="px-6">
            <TabsList className="mb-2 grid grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="dashboard">
                <LayoutDashboard className="w-4 h-4 mr-1" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="configure">
                <Settings2 className="w-4 h-4 mr-1" />
                Configure
              </TabsTrigger>
              <TabsTrigger value="metrics">
                <Activity className="w-4 h-4 mr-1" />
                Metrics
              </TabsTrigger>
              <TabsTrigger value="insights">
                <Lightbulb className="w-4 h-4 mr-1" />
                Insights
              </TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent>
            <AnimatePresence mode="wait">
              {/* Dashboard Tab */}
              {selectedTab === 'dashboard' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  key="dashboard"
                >
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="p-4">
                        <div className="flex justify-between">
                          <div className="text-muted-foreground text-sm">Active Versions</div>
                          <FlaskRound className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold mt-2">
                          {activeVersions.filter(v => v.status === 'active').length} 
                          <span className="text-sm text-muted-foreground font-normal ml-1">/ {activeVersions.length}</span>
                        </div>
                      </Card>
                      
                      <Card className="p-4">
                        <div className="flex justify-between">
                          <div className="text-muted-foreground text-sm">Total Conversions</div>
                          <Users className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="text-2xl font-bold mt-2">
                          {activeVersions.reduce((sum, v) => sum + v.metrics.conversions, 0)}
                        </div>
                      </Card>
                      
                      <Card className="p-4">
                        <div className="flex justify-between">
                          <div className="text-muted-foreground text-sm">Avg. Conversion Rate</div>
                          <BarChart4 className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div className="text-2xl font-bold mt-2">
                          {(activeVersions.reduce((sum, v) => sum + v.metrics.conversionRate, 0) / activeVersions.length).toFixed(1)}%
                        </div>
                      </Card>
                      
                      <Card className="p-4">
                        <div className="flex justify-between">
                          <div className="text-muted-foreground text-sm">Leading Version</div>
                          <LineChart className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="text-2xl font-bold mt-2">
                          {winner ? winner.name.split(' ')[0] : 'N/A'}
                        </div>
                      </Card>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Conversion Rate Over Time</h3>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsLineChart data={conversionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
                            <Legend />
                            {activeVersions.map((version, index) => (
                              version.status === 'active' && (
                                <Line 
                                  key={version.id}
                                  type="monotone" 
                                  dataKey={`version${version.name.split(' ')[0].slice(-1)}`} 
                                  name={version.name} 
                                  stroke={CHART_COLORS[index % CHART_COLORS.length]} 
                                  activeDot={{ r: 8 }} 
                                  strokeWidth={2}
                                />
                              )
                            ))}
                          </RechartsLineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Daily Engagement by Version</h3>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {activeVersions.map((version, index) => (
                              version.status === 'active' && (
                                <Bar 
                                  key={version.id}
                                  dataKey={`version${version.name.split(' ')[0].slice(-1)}`} 
                                  name={version.name} 
                                  fill={CHART_COLORS[index % CHART_COLORS.length]} 
                                />
                              )
                            ))}
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Configure Tab */}
              {selectedTab === 'configure' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  key="configure"
                >
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="test-name">Test Name</Label>
                          <Input 
                            id="test-name" 
                            value={testName} 
                            onChange={(e) => setTestName(e.target.value)} 
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="test-description">Description</Label>
                          <Input 
                            id="test-description" 
                            value={testDescription} 
                            onChange={(e) => setTestDescription(e.target.value)} 
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="confidence-level">Confidence Level: {confidenceLevel}%</Label>
                          <Slider 
                            id="confidence-level" 
                            min={80} 
                            max={99} 
                            step={1} 
                            value={[confidenceLevel]} 
                            onValueChange={(values) => setConfidenceLevel(values[0])} 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">Test Status</h3>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor="test-status" className="text-sm text-muted-foreground">
                              {isRunning ? 'Running' : 'Paused'}
                            </Label>
                            <Switch 
                              id="test-status" 
                              checked={isRunning} 
                              onCheckedChange={toggleTestStatus}
                            />
                          </div>
                        </div>
                        
                        <div className="rounded-md border p-4">
                          <h4 className="text-sm font-medium mb-2">Test Duration</h4>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center">
                              <input 
                                type="radio" 
                                id="duration-auto" 
                                name="duration" 
                                className="mr-2"
                                defaultChecked 
                              />
                              <Label htmlFor="duration-auto" className="text-sm cursor-pointer">
                                Auto (stop when statistically significant)
                              </Label>
                            </div>
                            <div className="flex items-center">
                              <input 
                                type="radio" 
                                id="duration-fixed" 
                                name="duration" 
                                className="mr-2" 
                              />
                              <Label htmlFor="duration-fixed" className="text-sm cursor-pointer">
                                Fixed duration
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-medium">Version Configuration</h3>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={addTestVersion}
                          disabled={activeVersions.length >= 5}
                        >
                          Add Version
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {activeVersions.map((version, index) => (
                          <Card key={version.id} className="p-4">
                            <div className="flex flex-wrap justify-between items-center gap-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                  {version.name.split(' ')[0]}
                                </Badge>
                                <Input 
                                  value={version.name} 
                                  onChange={(e) => {
                                    const newVersions = [...activeVersions];
                                    newVersions[index].name = e.target.value;
                                    setActiveVersions(newVersions);
                                  }} 
                                  className="max-w-[200px] h-8 text-sm"
                                />
                                <Badge 
                                  variant="outline" 
                                  className={getStatusBadge(version.status)}
                                >
                                  {version.status === 'active' ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Switch 
                                  checked={version.status === 'active'} 
                                  onCheckedChange={() => toggleVersionStatus(version.id)}
                                  disabled={version.id === 'v1'} // Don't allow toggling the control version
                                />
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-8 text-destructive hover:text-destructive/90"
                                  onClick={() => removeVersion(version.id)}
                                  disabled={version.id === 'v1' || activeVersions.length <= 2} // Don't allow removing the control or if only 2 versions
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm">Traffic Allocation</Label>
                                <span className="text-sm font-medium">{version.trafficAllocation}%</span>
                              </div>
                              <Slider 
                                min={10} 
                                max={90} 
                                step={1} 
                                value={[version.trafficAllocation]} 
                                onValueChange={(values) => updateTrafficAllocation(version.id, values[0])} 
                                disabled={!isRunning || version.status !== 'active'}
                              />
                            </div>
                            
                            {version.id !== 'v1' && version.status === 'active' && (
                              <div className="mt-2 text-xs text-muted-foreground">
                                Compared to control: 
                                {getPerformanceComparison(version) && (
                                  <span className={getPerformanceComparison(version)?.positive ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                    {' '}{getPerformanceComparison(version)?.positive ? '+' : ''}{getPerformanceComparison(version)?.value}%
                                  </span>
                                )}
                              </div>
                            )}
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Metrics Tab */}
              {selectedTab === 'metrics' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  key="metrics"
                >
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {activeVersions.map((version, index) => (
                        <Card key={version.id} className={`p-4 ${version.status === 'active' ? '' : 'opacity-60'}`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div 
                                className="h-3 w-3 rounded-full" 
                                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                              ></div>
                              <h3 className="font-medium">{version.name}</h3>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={getStatusBadge(version.status)}
                            >
                              {version.status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Conversions</p>
                              <p className="text-xl font-bold">{version.metrics.conversions}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Conversion Rate</p>
                              <div className="flex items-baseline">
                                <p className="text-xl font-bold mr-1">{version.metrics.conversionRate}%</p>
                                {getPerformanceComparison(version) && (
                                  <span className={`text-xs ${getPerformanceComparison(version)?.positive ? 'text-green-600' : 'text-red-600'}`}>
                                    {getPerformanceComparison(version)?.positive ? '↑' : '↓'} {Math.abs(Number(getPerformanceComparison(version)?.value))}%
                                  </span>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Avg. Session Time</p>
                              <p className="text-lg font-medium">{version.metrics.avgSessionTime}s</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Engagement Rate</p>
                              <p className="text-lg font-medium">{version.metrics.engagementRate}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">User Satisfaction</p>
                              <p className="text-lg font-medium">{version.metrics.userSatisfaction}/10</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Total Responses</p>
                              <p className="text-lg font-medium">{version.metrics.responses}</p>
                            </div>
                          </div>
                          
                          {winner && winner.id === version.id && (
                            <div className="mt-3 bg-green-50 text-green-800 p-2 rounded-md text-sm flex items-center">
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Leading variant
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-4">Comparative Metrics</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-medium mb-2">Conversion Rate</h4>
                          <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={activeVersions.map(v => ({ name: v.name, value: v.metrics.conversionRate }))} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                                <XAxis type="number" domain={[0, 5]} />
                                <YAxis type="category" dataKey="name" width={100} />
                                <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
                                <Bar dataKey="value" fill="#3B82F6" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-medium mb-2">User Satisfaction</h4>
                          <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={activeVersions.map(v => ({ name: v.name, value: v.metrics.userSatisfaction }))} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                                <XAxis type="number" domain={[0, 10]} />
                                <YAxis type="category" dataKey="name" width={100} />
                                <Tooltip formatter={(value) => [`${value}/10`, 'User Satisfaction']} />
                                <Bar dataKey="value" fill="#10B981" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Insights Tab */}
              {selectedTab === 'insights' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  key="insights"
                >
                  <div className="space-y-6">
                    <Card className="p-5 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-50/30">
                      <div className="flex gap-3 items-start">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Lightbulb className="h-6 w-6 text-blue-600" />
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-base mb-1">Key Insights</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Based on current data, here are the key insights for improving your agent's performance.
                          </p>
                          
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-green-600 mt-0.5" />
                              <span className="text-sm">
                                <span className="font-medium">Version B</span> is showing <span className="text-green-600 font-medium">18.8% higher</span> conversion rates than the control group.
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-green-600 mt-0.5" />
                              <span className="text-sm">
                                Average session time is <span className="font-medium">13.6% longer</span> in Version B compared to other versions.
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-green-600 mt-0.5" />
                              <span className="text-sm">
                                Users are <span className="font-medium">consistently more satisfied</span> with Version B's responses across all metrics.
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-5">
                      <h3 className="font-medium text-base mb-3">Recommendations</h3>
                      
                      <div className="space-y-4">
                        <div className="p-3 border rounded-md flex items-start gap-3 bg-gradient-to-r from-green-50 to-green-50/30">
                          <div className="bg-green-100 p-1.5 rounded-full mt-0.5">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Consider making Version B your primary agent</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Based on consistent performance improvements across all metrics, Version B is showing significant advantages over other versions.
                            </p>
                            <Button variant="outline" size="sm" className="mt-2">
                              <Download className="h-3.5 w-3.5 mr-1" />
                              Generate Report
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-3 border rounded-md flex items-start gap-3">
                          <div className="bg-yellow-100 p-1.5 rounded-full mt-0.5">
                            <Lightbulb className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Continue testing to improve statistical significance</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Current confidence level is at 92%. We recommend continuing the test until you reach your target confidence level of 95%.
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-5">
                      <h3 className="font-medium text-base mb-3">Performance Analysis</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-xs font-medium mb-1">Statistical Significance</h4>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }}></div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                            <span>0%</span>
                            <span>92% (Current)</span>
                            <span>100%</span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="text-xs font-medium mb-2">Detailed Version Comparison</h4>
                          <div className="relative overflow-x-auto rounded-md border">
                            <table className="w-full text-sm text-left">
                              <thead className="text-xs bg-muted/50">
                                <tr>
                                  <th className="px-4 py-2">Version</th>
                                  <th className="px-4 py-2">Traffic</th>
                                  <th className="px-4 py-2">Conv. Rate</th>
                                  <th className="px-4 py-2">Engagement</th>
                                  <th className="px-4 py-2">Satisfaction</th>
                                </tr>
                              </thead>
                              <tbody>
                                {activeVersions.map((version, i) => (
                                  <tr key={version.id} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                                    <td className="px-4 py-2 font-medium">{version.name}</td>
                                    <td className="px-4 py-2">{version.trafficAllocation}%</td>
                                    <td className="px-4 py-2">
                                      <span className={version === winner ? 'font-medium text-green-600' : ''}>
                                        {version.metrics.conversionRate}%
                                      </span>
                                    </td>
                                    <td className="px-4 py-2">{version.metrics.engagementRate}%</td>
                                    <td className="px-4 py-2">{version.metrics.userSatisfaction}/10</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

