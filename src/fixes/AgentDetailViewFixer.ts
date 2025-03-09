
/**
 * This file contains functions to ensure type safety in AgentDetailView.tsx
 */

import { TestCase } from "@/types/agent-creation";
import { Json } from "@/integrations/supabase/types";

// Function to ensure test case is properly typed
export const ensureValidTestCaseStatus = (testCase: any): TestCase => {
  // Convert any string status to one of the allowed enum values
  let validStatus: TestCase['status'] = testCase.status;
  
  // Make sure status is one of the allowed values
  if (testCase.status && typeof testCase.status === 'string') {
    if (!['success', 'failure', 'pending', 'passed', 'failed', 'running'].includes(testCase.status)) {
      validStatus = 'pending';
    }
  }
  
  return {
    id: testCase.id,
    name: testCase.name || `Test ${testCase.id}`,
    input: testCase.input,
    expectedOutput: testCase.expectedOutput,
    actualOutput: testCase.actualOutput,
    status: validStatus
  };
};

// Function to safely convert test cases array
export const convertToTestCases = (data: any[]): TestCase[] => {
  if (!Array.isArray(data)) return [];
  return data.map(ensureValidTestCaseStatus);
};

// Function to safely convert JSON to test cases
export const convertJsonToTestCases = (json: Json): TestCase[] => {
  if (!json || typeof json !== 'object') return [];
  
  try {
    const data = Array.isArray(json) ? json : [];
    return convertToTestCases(data);
  } catch (error) {
    console.error("Error converting JSON to test cases:", error);
    return [];
  }
};
