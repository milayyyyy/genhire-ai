'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function TestSupabase() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('users').select('count', { count: 'exact' })
      if (error) throw error
      setResult(`Connection successful! Total users: ${data[0]?.count || 0}`)
    } catch (err) {
      setResult(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <button 
        onClick={testConnection}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      <div className="mt-4 p-4 border rounded bg-gray-50">
        <pre>{result}</pre>
      </div>
    </div>
  )
}
