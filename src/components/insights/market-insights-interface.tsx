"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown,
  Building,
  DollarSign,
  Users,
  Award,
  Calendar,
  BarChart3,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface LeagueTableEntry {
  rank: number;
  firm: string;
  dealValue: number; // in billions
  dealCount: number;
  marketShare: number;
  change: number; // percentage change from previous period
}

interface HiringTrend {
  id: string;
  desk: string;
  status: 'hiring' | 'freezing' | 'stable';
  change: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface SalaryBenchmark {
  firm: string;
  role: string;
  baseRange: { min: number; max: number };
  bonusRange: { min: number; max: number };
  totalComp: { min: number; max: number };
  year: number;
}

const leagueTableData: LeagueTableEntry[] = [
  {
    rank: 1,
    firm: 'Goldman Sachs',
    dealValue: 125.6,
    dealCount: 43,
    marketShare: 18.2,
    change: 5.3
  },
  {
    rank: 2,
    firm: 'J.P. Morgan',
    dealValue: 118.2,
    dealCount: 51,
    marketShare: 17.1,
    change: -2.1
  },
  {
    rank: 3,
    firm: 'Morgan Stanley',
    dealValue: 95.3,
    dealCount: 38,
    marketShare: 13.8,
    change: 8.7
  },
  {
    rank: 4,
    firm: 'Bank of America',
    dealValue: 87.9,
    dealCount: 42,
    marketShare: 12.7,
    change: 3.2
  },
  {
    rank: 5,
    firm: 'Citi',
    dealValue: 76.4,
    dealCount: 35,
    marketShare: 11.0,
    change: -5.8
  },
  {
    rank: 6,
    firm: 'Barclays',
    dealValue: 64.2,
    dealCount: 29,
    marketShare: 9.3,
    change: 12.4
  }
];

const hiringTrends: HiringTrend[] = [
  {
    id: 'tech-coverage',
    desk: 'Technology Coverage',
    status: 'hiring',
    change: '+25% headcount',
    description: 'Strong demand for TMT bankers across all levels',
    priority: 'high'
  },
  {
    id: 'energy-restructuring',
    desk: 'Energy & Restructuring',
    status: 'hiring',
    change: '+15% headcount',
    description: 'Increased activity in energy transition deals',
    priority: 'high'
  },
  {
    id: 'healthcare-coverage',
    desk: 'Healthcare Coverage',
    status: 'stable',
    change: 'Steady hiring',
    description: 'Consistent pharma and biotech M&A activity',
    priority: 'medium'
  },
  {
    id: 'real-estate',
    desk: 'Real Estate Banking',
    status: 'freezing',
    change: 'Hiring freeze',
    description: 'Market slowdown affecting commercial real estate',
    priority: 'low'
  },
  {
    id: 'leveraged-finance',
    desk: 'Leveraged Finance',
    status: 'stable',
    change: 'Selective hiring',
    description: 'Credit markets stabilizing, moderate deal flow',
    priority: 'medium'
  }
];

const salaryBenchmarks: SalaryBenchmark[] = [
  {
    firm: 'Goldman Sachs',
    role: 'Analyst (Year 1)',
    baseRange: { min: 110, max: 125 },
    bonusRange: { min: 50, max: 85 },
    totalComp: { min: 160, max: 210 },
    year: 2024
  },
  {
    firm: 'J.P. Morgan',
    role: 'Analyst (Year 1)',
    baseRange: { min: 110, max: 125 },
    bonusRange: { min: 45, max: 80 },
    totalComp: { min: 155, max: 205 },
    year: 2024
  },
  {
    firm: 'Morgan Stanley',
    role: 'Analyst (Year 1)',
    baseRange: { min: 110, max: 125 },
    bonusRange: { min: 45, max: 75 },
    totalComp: { min: 155, max: 200 },
    year: 2024
  },
  {
    firm: 'Goldman Sachs',
    role: 'Associate (Year 1)',
    baseRange: { min: 175, max: 195 },
    bonusRange: { min: 100, max: 150 },
    totalComp: { min: 275, max: 345 },
    year: 2024
  }
];

export function MarketInsightsInterface() {
  const [selectedTab, setSelectedTab] = useState('league-tables');

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-muted-foreground';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3" />;
    if (change < 0) return <TrendingDown className="h-3 w-3" />;
    return null;
  };

  const getStatusColor = (status: HiringTrend['status']) => {
    switch (status) {
      case 'hiring': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'freezing': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'stable': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getStatusIcon = (status: HiringTrend['status']) => {
    switch (status) {
      case 'hiring': return <CheckCircle className="h-4 w-4" />;
      case 'freezing': return <AlertCircle className="h-4 w-4" />;
      case 'stable': return <Target className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount}k`;
  };

  return (
    <div className="space-y-6">
      {/* Market Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Total Deal Value</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">$690B</span>
              <p className="text-xs text-muted-foreground">Q2 2024</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Deal Count</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">238</span>
              <p className="text-xs text-muted-foreground">Transactions</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Market Growth</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-green-400">+12%</span>
              <p className="text-xs text-muted-foreground">vs Q1 2024</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Hiring Index</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">75</span>
              <p className="text-xs text-muted-foreground">Strong</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="league-tables">League Tables</TabsTrigger>
          <TabsTrigger value="hiring-trends">Hiring Trends</TabsTrigger>
          <TabsTrigger value="salary-data">Salary Data</TabsTrigger>
        </TabsList>

        <TabsContent value="league-tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                M&A League Tables - Q2 2024
              </CardTitle>
              <CardDescription>
                Ranked by total deal value across all sectors and regions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leagueTableData.map((entry) => (
                  <div key={entry.rank} className="flex items-center justify-between p-4 bg-accent/20 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {entry.rank}
                      </div>
                      <div>
                        <h4 className="font-medium">{entry.firm}</h4>
                        <p className="text-sm text-muted-foreground">
                          {entry.dealCount} deals • {entry.marketShare}% market share
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold">${entry.dealValue}B</div>
                      <div className={`text-sm flex items-center gap-1 justify-end ${getChangeColor(entry.change)}`}>
                        {getChangeIcon(entry.change)}
                        {entry.change > 0 ? '+' : ''}{entry.change}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hiring-trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Investment Banking Hiring Trends 2024
              </CardTitle>
              <CardDescription>
                Real-time hiring signals across major investment banking desks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hiringTrends.map((trend) => (
                  <Card key={trend.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(trend.status)}`}>
                          {getStatusIcon(trend.status)}
                        </div>
                        <div>
                          <h4 className="font-medium">{trend.desk}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {trend.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(trend.status)} mb-1`}
                        >
                          {trend.status.charAt(0).toUpperCase() + trend.status.slice(1)}
                        </Badge>
                        <p className="text-sm font-medium">{trend.change}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary-data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Compensation Benchmarks 2024
              </CardTitle>
              <CardDescription>
                Total compensation by firm, role, and experience level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {salaryBenchmarks.map((benchmark, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{benchmark.firm}</h4>
                        <p className="text-sm text-muted-foreground">{benchmark.role}</p>
                      </div>
                      <Badge variant="outline">{benchmark.year}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Base Salary</p>
                        <p className="font-medium">
                          {formatCurrency(benchmark.baseRange.min)} - {formatCurrency(benchmark.baseRange.max)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Bonus Range</p>
                        <p className="font-medium">
                          {formatCurrency(benchmark.bonusRange.min)} - {formatCurrency(benchmark.bonusRange.max)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Total Compensation</p>
                        <p className="font-medium text-primary">
                          {formatCurrency(benchmark.totalComp.min)} - {formatCurrency(benchmark.totalComp.max)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}