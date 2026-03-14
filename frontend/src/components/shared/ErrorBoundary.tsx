import { Component, type ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 h-full flex items-center justify-center">
                    <Card className="border-red-200 bg-red-50 max-w-md w-full shadow-lg">
                        <CardContent className="flex flex-col items-center justify-center py-10 px-6 text-center">
                            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                            <h2 className="text-xl font-bold font-display text-red-900 mb-2">Something went wrong</h2>
                            <p className="text-sm text-red-600 mb-6 break-words max-w-full">
                                {this.state.error?.message || 'An unexpected error occurred while rendering this module.'}
                            </p>
                            <Button
                                variant="outline"
                                className="bg-white hover:bg-red-100 hover:text-red-900 border-red-200 gap-2"
                                onClick={() => {
                                    this.setState({ hasError: false, error: null });
                                    window.location.reload();
                                }}
                            >
                                Reload Page
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
