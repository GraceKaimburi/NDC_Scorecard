import { NextResponse } from 'next/server';

export async function GET() {
  // This is sample data - replace with your actual questions from a database
  const questions = [
    {
      id: 'finance-1',
      text: 'How would you rate the financial management capacity?',
      category: 'finance'
    },
    {
      id: 'technical-1',
      text: 'How would you rate the technical implementation capacity?',
      category: 'technical'
    },
    {
      id: 'governance-1',
      text: 'How would you rate the governance structure?',
      category: 'governance'
    },
    {
      id: 'monitoring-1',
      text: 'How would you rate the monitoring and evaluation system?',
      category: 'monitoring'
    }
  ];

  return NextResponse.json(questions);
}