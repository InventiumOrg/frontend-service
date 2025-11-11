import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug inventory API endpoint called');
    
    // Get Clerk auth
    const { getToken, userId } = await auth();
    const clerkToken = await getToken();
    
    // Get all headers
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    
    // Get cookies
    const cookies = request.cookies.getAll();
    
    console.log('🔍 Debug info:', {
      userId,
      hasClerkToken: !!clerkToken,
      clerkTokenPreview: clerkToken ? `${clerkToken.substring(0, 30)}...` : 'No token',
      authorizationHeader: headers['authorization'] || 'Missing',
      allHeaders: Object.keys(headers),
      cookies: cookies.map(c => ({ name: c.name, hasValue: !!c.value })),
    });
    
    // Try to make a request to the backend inventory API
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:13740/v1';
    const testUrl = `${backendUrl}/inventory/list`;
    
    console.log('🔍 Testing backend request to:', testUrl);
    
    const backendHeaders: Record<string, string> = {};
    if (clerkToken) {
      backendHeaders['Authorization'] = `Bearer ${clerkToken}`;
    }
    
    try {
      const backendResponse = await fetch(testUrl, {
        method: 'GET',
        headers: backendHeaders,
      });
      
      console.log('🔍 Backend response:', {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        headers: Object.fromEntries(backendResponse.headers.entries()),
      });
      
      const backendData = await backendResponse.text();
      console.log('🔍 Backend response body:', backendData.substring(0, 200));
      
      return NextResponse.json({
        success: true,
        debug: {
          clerk: {
            userId,
            hasToken: !!clerkToken,
            tokenPreview: clerkToken ? `${clerkToken.substring(0, 30)}...` : 'No token',
          },
          request: {
            authHeader: headers['authorization'] || 'Missing',
            userAgent: headers['user-agent'] || 'Missing',
            cookies: cookies.length,
          },
          backend: {
            url: testUrl,
            status: backendResponse.status,
            statusText: backendResponse.statusText,
            responsePreview: backendData.substring(0, 200),
          }
        }
      });
    } catch (backendError) {
      console.error('❌ Backend request failed:', backendError);
      return NextResponse.json({
        success: false,
        error: 'Backend request failed',
        debug: {
          clerk: {
            userId,
            hasToken: !!clerkToken,
            tokenPreview: clerkToken ? `${clerkToken.substring(0, 30)}...` : 'No token',
          },
          backendError: backendError instanceof Error ? backendError.message : 'Unknown error',
        }
      });
    }
  } catch (error) {
    console.error('❌ Debug endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 Debug inventory PUT endpoint called');
    
    // Get Clerk auth
    const { getToken, userId } = await auth();
    const clerkToken = await getToken();
    
    // Get request body
    const body = await request.text();
    
    // Get all headers
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    
    console.log('🔍 PUT Debug info:', {
      userId,
      hasClerkToken: !!clerkToken,
      clerkTokenPreview: clerkToken ? `${clerkToken.substring(0, 30)}...` : 'No token',
      authorizationHeader: headers['authorization'] || 'Missing',
      contentType: headers['content-type'] || 'Missing',
      bodyPreview: body.substring(0, 200),
      bodyLength: body.length,
    });
    
    // Try to make requests to the backend with both formats
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:13740/v1';
    const testUrl = `${backendUrl}/inventory/1`; // Test with item ID 1
    
    const results: any[] = [];
    
    // Test 1: Original format (form data or whatever was sent)
    try {
      console.log('🔍 Testing original format...');
      const backendHeaders1: Record<string, string> = {
        'Content-Type': headers['content-type'] || 'application/x-www-form-urlencoded',
      };
      
      if (clerkToken) {
        backendHeaders1['Authorization'] = `Bearer ${clerkToken}`;
      }
      
      const response1 = await fetch(testUrl, {
        method: 'PUT',
        headers: backendHeaders1,
        body: body,
      });
      
      const responseText1 = await response1.text();
      results.push({
        format: 'Original (' + (headers['content-type'] || 'form-data') + ')',
        status: response1.status,
        statusText: response1.statusText,
        responseBody: responseText1,
        success: response1.ok,
      });
      
      console.log('🔍 Original format result:', {
        status: response1.status,
        responsePreview: responseText1.substring(0, 100),
      });
    } catch (error1) {
      results.push({
        format: 'Original',
        error: error1 instanceof Error ? error1.message : 'Unknown error',
        success: false,
      });
    }
    
    // Test 2: JSON format (if original wasn't JSON)
    if (headers['content-type'] !== 'application/json') {
      try {
        console.log('🔍 Testing JSON format...');
        
        // Convert form data to JSON if needed
        let jsonBody = body;
        if (headers['content-type'] === 'application/x-www-form-urlencoded') {
          const params = new URLSearchParams(body);
          const jsonData: any = {};
          for (const [key, value] of params.entries()) {
            // Convert Quantity to number
            jsonData[key] = key === 'Quantity' ? parseInt(value) : value;
          }
          jsonBody = JSON.stringify(jsonData);
        }
        
        const backendHeaders2: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (clerkToken) {
          backendHeaders2['Authorization'] = `Bearer ${clerkToken}`;
        }
        
        const response2 = await fetch(testUrl, {
          method: 'PUT',
          headers: backendHeaders2,
          body: jsonBody,
        });
        
        const responseText2 = await response2.text();
        results.push({
          format: 'JSON',
          status: response2.status,
          statusText: response2.statusText,
          responseBody: responseText2,
          success: response2.ok,
          convertedBody: jsonBody,
        });
        
        console.log('🔍 JSON format result:', {
          status: response2.status,
          responsePreview: responseText2.substring(0, 100),
        });
      } catch (error2) {
        results.push({
          format: 'JSON',
          error: error2 instanceof Error ? error2.message : 'Unknown error',
          success: false,
        });
      }
    }
    
    return NextResponse.json({
      success: results.some(r => r.success),
      debug: {
        request: {
          hasToken: !!clerkToken,
          tokenPreview: clerkToken ? `${clerkToken.substring(0, 30)}...` : 'No token',
          contentType: headers['content-type'],
          bodyLength: body.length,
          bodyPreview: body.substring(0, 100),
        },
        results: results,
      }
    });
  } catch (error) {
    console.error('❌ Debug PUT endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}