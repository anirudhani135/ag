
import { IntegrationFormData } from "@/components/agent-creation/integration/types";

export interface BasicInfoFormData {
  title: string;
  description: string;
  category: string;
  price: string;
  tags: string[];
}

export interface ConfigFormData {
  model: string;
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
  apiEndpoint?: string;
  enableLogging: boolean;
  enableMetrics: boolean;
  enableRateLimiting: boolean;
  requestsPerMinute?: number;
}

export interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput?: string;
  actualOutput?: string;
  status?: "success" | "failure" | "pending" | "passed" | "failed" | "running";
}

export interface WizardStep {
  id: string;
  title: string;
  isCompleted: boolean;
}
