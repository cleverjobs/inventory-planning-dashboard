"use client"
import React from "react"
import { ErrorPopup } from "@/core/ui/error-popup"

interface ErrorBoundaryState { hasError: boolean; error?: Error }

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: any) {
    console.error("Uncaught error:", error, info)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: undefined })
    if (typeof window !== 'undefined') window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPopup error={this.state.error} onDismiss={this.handleReload} fatal />
    }
    return this.props.children
  }
}
