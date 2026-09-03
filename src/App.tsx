/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { ViewType } from './components/Sidebar';
import { PlaceholderView } from './components/PlaceholderView';
import { UnderstandingMapView } from './components/views/UnderstandingMapView';
import { ForecastView } from './components/views/ForecastView';
import { MistakeLabView } from './components/views/MistakeLabView';
import { SimulationsView } from './components/views/SimulationsView';
import { EvidenceView } from './components/views/EvidenceView';
import { ProgressView } from './components/views/ProgressView';
import { NotebookView } from './components/views/NotebookView';
import { ChallengeEchoView } from './components/views/ChallengeEchoView';
import { UIProvider } from './context/UIContext';
import { GlobalModals } from './components/ui-layer/Modals';
import { Toast } from './components/ui-layer/Toast';
import { AICopilot } from './components/AICopilot';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');

  const renderView = () => {
    switch(currentView) {
      case 'home':
        return <Dashboard onViewChange={setCurrentView} />;
      case 'map':
        return <UnderstandingMapView onViewChange={setCurrentView} />;
      case 'forecast':
        return <ForecastView onViewChange={setCurrentView} />;
      case 'mistake-lab':
        return <MistakeLabView onViewChange={setCurrentView} />;
      case 'simulations':
        return <SimulationsView />;
      case 'evidence':
        return <EvidenceView />;
      case 'progress':
        return <ProgressView />;
      case 'notebook':
        return <NotebookView />;
      case 'challenge-echo':
        return <ChallengeEchoView />;
      default:
        return <PlaceholderView view={currentView} />;
    }
  };

  return (
    <UIProvider>
      <Layout currentView={currentView} onViewChange={setCurrentView}>
        {renderView()}
      </Layout>
      <GlobalModals />
      <Toast />
      <AICopilot />
    </UIProvider>
  );
}
