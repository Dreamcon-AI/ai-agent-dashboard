import { useSession, signIn, signOut } from "next-auth/react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DirectoryAgent from "./Agents/DirectoryAgent";
import FinancialPlanningAgent from "./Agents/FinancialPlanningAgent";
import SchedulingAgent from "./Agents/SchedulingAgent"; 
import LegalReviewAgent from "./Agents/LegalReviewAgent";
import OnboardingAgent from "./Agents/OnboardingAgent";
import TakeoffAgent from "./Agents/TakeoffAgent";
import LeadAgent from './Agents/LeadAgent';
import FleetAgent from './Agents/FleetAgent';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const divisions = [
  "HR",
  "Sales",
  "Finance",
  "Production",
  "Quality Control",
  "Public Relations",
  "Legal",
];

const emojiMap = {
  Onboarding: "📋",
  NewHirePacket: "🗂️",
  EmployeeDirectoryManager: "📗",
  CommunicationManager: "✉️",
  StatsReporter: "📊",
  LeadTracker: "🧲",
  ProposalWriter: "📌",
  BidSubmitter: "📄",
  AwardMonitor: "🏆",
  EstimatingAgent: "📐",
  AccountsReceivable: "💰",
  AccountsPayable: "💸",
  DocumentManager: "📁",
  ContractLogger: "🧾",
  BudgetMonitor: "🧪",
  PreConstructionPlanner: "🚧",
  CrewScheduler: "👷",
  ProjectScheduler: "🗖",
  EquipmentAllocator: "🔧",
  SpecValidator: "🔍",
  CustomerFeedback: "📣",
  TrainingCoordinator: "📚",
  JobsiteAuditor: "🚰",
  InternalEvents: "🎉",
  MarketResearch: "📈",
  WebsiteSEO: "🌐",
  SocialMediaPublisher: "📱",
  CEOUpdates: "📋",
  LegalReview: "⚖️",
  BoardCommunicator: "📝",
  RiskManager: "🚨",
};

const agents = {
  HR: [
    {
      dept: "Onboarding",
      agent: "Onboarding",
      title: "Onboarding Agent",
      instructions:
        "Automates the new hire process: forms, routing, HR upload, and DocuSign.",
      component: OnboardingAgent,
    },
    {
      dept: "Employee Records",
      agent: "EmployeeDirectoryManager",
      title: "Directory Agent",
      instructions:
        "View and search stored employee contact info collected during onboarding.",
      component: DirectoryAgent,
    },
  ],

  Production: [
    {
      dept: "Scheduling",
      agent: "SchedulingAgent",
      title: "Scheduling Agent",
      instructions:
        "Pulls and schedules jobs using Google Calendar. Assign crews, equipment, and dates.",
      component: SchedulingAgent,
    },
    {
      dept: "Fleet",
      agent: "FleetAgent",
      title: "Fleet Management Agent",
      instructions: 
        "Manages the service, files, logs, and availability of the truck and equipment fleet.",
      component: FleetAgent,
    }
  ],

  Legal: [
    {
      dept: "Contract Law Review",
      agent: "LegalReview",
      title: "Legal Review Agent",
      instructions:
        "Upload the GC contract and Zochert proposal PDFs. The agent will scan for legal red flags and mismatches.",
      component: LegalReviewAgent,
    },
  ],

  Finance: [
    {
      dept: "Planning",
      agent: "FinancialPlanningAgent",
      title: "Financial Planning Agent",
      instructions:
        "Analyzes budgets, cash flow, and future projections. Connects with financial systems.",
      component: FinancialPlanningAgent,
    },
  ],

  Sales: [
    {
      dept: "Leads",
      agent: "LeadAgent",
      title: "Lead Agent",
      instructions:
        "Find projects that have fence and/or gates for us to bid. This agent will find projects and download plans and specifications.",
      component: LeadAgent,
    },
    {
      dept: "Bidding/Estimating",
      agent: "TakeoffAgent",
      title: "Takeoff Agent",
      instructions:
        "Upload plans and describe scope. This agent will generate a full material list, cost summary, and optionally a submittal.",
      component: TakeoffAgent,
    },
  ],
};

export default function AIAgentDashboard() {
  const { data: session, status } = useSession();
  const [selectedDivision, setSelectedDivision] = useState(divisions[0]);
  const [activeAgent, setActiveAgent] = useState(null);
  const [output, setOutput] = useState(null);
  const [gcContractName, setGcContractName] = useState("");
  const [proposalName, setProposalName] = useState("");

  const handleOpenAgent = ({ agent, dept, component, title, instructions }) => {
    setActiveAgent({ agent, dept, component, title, instructions });
    setOutput(null);
    setGcContractName("");
    setProposalName("");
  };

  if (status === "loading") {
    return (
      <div className="p-10 text-center text-gray-700 text-lg">
        Loading session...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <img src="/dc.png" alt="DreamCon Logo" className="h-72 mb-6" />
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          AI Agent Dashboard
        </h1>
        <p className="mb-6 text-gray-600">You must be signed in to continue.</p>
        <Button
          onClick={() => signIn("github")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700"
        >
          Sign in with GitHub
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-gray-100 to-white bg-opacity-70 min-h-screen font-sans text-white">
      <div className="flex justify-end mb-6">
        <Button
          onClick={() => signOut()}
          className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
        >
          Sign Out ({session.user.name})
        </Button>
      </div>

      <div className="flex flex-col items-center mb-10">
        <img
          src="/dc.png"
          alt="DreamCon Logo"
          className="h-72 mb-6 object-contain bg-transparent"
        />
        <h1 className="text-5xl font-extrabold text-center text-gray-700 drop-shadow-sm tracking-tight">
          AI Agent
        </h1>
      </div>

      <div className="mb-8 overflow-x-auto">
        <div className="inline-flex gap-4 px-4 py-2 rounded-full bg-gray-700 shadow-inner border border-gray-600 w-full justify-center">
          {divisions.map((div) => (
            <button
              key={div}
              onClick={() => setSelectedDivision(div)}
              className={`w-48 h-14 flex items-center justify-center rounded-full text-md font-semibold transition-all shadow-md ${
                selectedDivision === div
                  ? "bg-gray-300 text-gray-800"
                  : "bg-gray-600 text-white hover:bg-indigo-300 hover:text-black"
              }`}
            >
              {div}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {agents[selectedDivision]?.map(
          ({ dept, agent, component, title, instructions }) => {
            const AgentComponent = component;
            return (
              <Card
                key={`${dept}-${agent}`}
                className="shadow-md border border-gray-700 rounded-xl bg-gray-700 hover:shadow-lg transition-transform duration-300"
              >
                <CardContent className="p-6 relative bg-gray-700 rounded-xl">
                  <div className="absolute top-4 right-4 bg-white text-gray-800 w-20 h-20 flex items-center justify-center text-3xl font-bold rounded-full shadow-lg">
                    {emojiMap[agent] || "🤖"}
                  </div>
                  <h2 className="text-lg font-semibold text-white mb-1 tracking-wide">
                    {title || dept}
                  </h2>
                  <p className="text-sm text-white italic mb-4">
                    Agent:{" "}
                    <span className="font-medium text-white">{agent}</span>
                  </p>

                  <Dialog
                    open={activeAgent?.agent === agent}
                    onOpenChange={(open) =>
                      setActiveAgent(
                        open
                          ? { agent, dept, component, title, instructions }
                          : null
                      )
                    }
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full px-4"
                        onClick={() =>
                          handleOpenAgent({
                            agent,
                            dept,
                            component,
                            title,
                            instructions,
                          })
                        }
                      >
                        Open Agent
                      </Button>
                    </DialogTrigger>

                    {activeAgent?.agent === agent && component && (
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white text-black rounded-xl p-6">
                        <DialogHeader className="text-black">
                          <DialogTitle className="text-2xl font-bold text-black">
                            {title}
                          </DialogTitle>
                          <DialogDescription className="text-sm text-black">
                            {instructions}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                          <AgentComponent
                            open={activeAgent?.agent === agent}
                            onClose={() => setActiveAgent(null)}
                            agent={agent}
                            dept={dept}
                          />
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>
                </CardContent>
              </Card>
            );
          }
        )}
      </div>
    </div>
  );
}
