import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: 'var(--text)',
          background: 'var(--panel)',
          borderRadius: '12px',
          margin: '20px'
        }}>
          <h2>เกิดข้อผิดพลาด</h2>
          <p>ขออภัย เกิดข้อผิดพลาดที่ไม่คาดคิด</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: 'var(--accent)',
              color: '#05140c',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            รีเฟรชหน้า
          </button>
          {this.state.error && (
            <details style={{marginTop: '20px', textAlign: 'left'}}>
              <summary>รายละเอียดข้อผิดพลาด</summary>
              <pre style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '10px',
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto'
              }}>
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}