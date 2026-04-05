// Create Ticket Page - Enhanced with new categories and GPS location

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { ArrowLeft, Upload, Mic, Bot, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { TicketService } from '../services/ticket-service';
import type { TicketCategory, Location } from '../types';
import { toast } from 'sonner';

export default function CreateTicket() {
  const navigate = useNavigate();
  const { currentUser, addTicket, refreshTickets, isAuthenticated } = useApp();
  const { t } = useLanguage();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TicketCategory | ''>('');
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice input is not supported in this browser. Try Chrome or Edge.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setIsRecording(true);
    toast.info('Listening... Speak now');
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setDescription(prev => (prev ? prev + ' ' + transcript : transcript).trim());
      setIsRecording(false);
      toast.success('Voice input captured!');
    };
    recognition.onerror = () => {
      setIsRecording(false);
      toast.error('Could not capture voice. Please try again.');
    };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to create a ticket');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const categories: { value: TicketCategory; label: string; requiresLocation?: boolean }[] = [
    { value: 'Technical Issue', label: t('category.technical') },
    { value: 'Billing', label: t('category.billing') },
    { value: 'Service Request', label: t('category.service') },
    { value: 'Infrastructure', label: t('category.infrastructure'), requiresLocation: true },
    { value: 'Social Media Complaint', label: t('category.socialMedia') },
    { value: 'Harassment', label: t('category.harassment'), requiresLocation: true },
    { value: 'Cybercrime', label: t('category.cybercrime') },
    { value: 'Public Safety', label: t('category.publicSafety'), requiresLocation: true },
    { value: 'Environmental Issue', label: t('category.environmental'), requiresLocation: true },
    { value: 'Corruption Report', label: t('category.corruption') },
    { value: 'Account Issue', label: t('category.account') },
    { value: 'Bug Report', label: t('category.bug') },
    { value: 'Feature Request', label: t('category.feature') },
    { value: 'General Inquiry', label: t('category.inquiry') },
    { value: 'Other', label: t('category.other') },
  ];

  const selectedCategory = categories.find(c => c.value === category);
  const requiresLocation = selectedCategory?.requiresLocation || false;

  const handleGetLocation = () => {
    setIsGettingLocation(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: `Lat: ${position.coords.latitude.toFixed(6)}, Long: ${position.coords.longitude.toFixed(6)}`,
            timestamp: new Date(),
          };
          setLocation(loc);
          setIsGettingLocation(false);
          toast.success('Location captured successfully!');
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsGettingLocation(false);
          toast.error('Unable to get location. Please enable GPS and try again.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setIsGettingLocation(false);
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== TICKET SUBMISSION DEBUG ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('currentUser:', currentUser);
    console.log('title:', title);
    console.log('description:', description);
    console.log('category:', category);
    console.log('location:', location);
    
    // Check authentication
    if (!isAuthenticated || !currentUser || !currentUser.id) {
      toast.error('Session expired. Please login again.');
      navigate('/login');
      return;
    }
    
    // Validate title
    if (!title || title.trim() === '') {
      toast.error('Please enter a title for your ticket');
      return;
    }
    
    // Validate description
    if (!description || description.trim() === '') {
      toast.error('Please enter a description for your ticket');
      return;
    }
    
    // Validate category
    if (!category) {
      toast.error('Please select a category');
      return;
    }

    // Validate location if required
    if (requiresLocation && !location) {
      toast.error('Location is required for this category. Please capture your location.');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Creating ticket with data:', {
        title,
        description,
        category,
        createdBy: currentUser,
        location,
      });
      
      // Create ticket using the service
      const newTicket = TicketService.createTicket({
        title: title.trim(),
        description: description.trim(),
        category: category as TicketCategory,
        createdBy: currentUser,
        location: location || undefined,
      });

      console.log('Ticket created successfully:', newTicket);

      // Add to context
      addTicket(newTicket);
      
      // Refresh tickets to ensure sync
      setTimeout(() => {
        refreshTickets();
      }, 100);

      // Show success message
      toast.success(
        newTicket.isAIResolved 
          ? 'Ticket auto-resolved by AI! Check your dashboard.'
          : `Ticket ${newTicket.id} created successfully!`,
        {
          description: newTicket.isAIResolved 
            ? 'Our AI system was able to resolve your issue automatically.'
            : 'Your complaint has been registered and assigned for processing.',
        }
      );

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error(`Failed to create ticket: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIAnalysis = () => {
    if (!title && !description) {
      toast.error('Please enter title and description first');
      return;
    }
    
    // Simulate AI analysis
    setAiSuggestion(
      'Based on your description, this appears to be a common issue. Try checking your browser cache and cookies first. If the problem persists, our team will investigate further.'
    );
    toast.info('AI analysis complete!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <Link to="/">
        <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-[#01411C]">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Button>
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#01411C] to-[#0B5D1E] text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold">Create New Complaint</h1>
        <p className="text-white/90 mt-1">شکایت درج کریں • Submit a complaint or request for assistance</p>
      </div>

      {/* Main Form */}
      <Card className="border-2 border-[#01411C]/20">
        <CardHeader className="bg-[#DFF5E1]/50">
          <CardTitle className="text-[#01411C]">Ticket Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#01411C] font-semibold">
                Title <span className="text-[#DC3545]">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Brief description of your issue"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border-[#01411C]/20 focus:border-[#01411C]"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#01411C] font-semibold">
                Description <span className="text-[#DC3545]">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about your issue..."
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="border-[#01411C]/20 focus:border-[#01411C]"
              />
              <div className="flex items-center space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleAIAnalysis}
                  disabled={!title && !description}
                  className="border-[#01411C]/30 text-[#01411C] hover:bg-[#DFF5E1]"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Get AI Suggestion
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleVoiceInput}
                  disabled={isRecording}
                  className={`border-[#01411C]/30 text-[#01411C] hover:bg-[#DFF5E1] ${isRecording ? 'bg-red-50 border-red-400 text-red-700 animate-pulse' : ''}`}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  {isRecording ? 'Listening...' : 'Voice Input'}
                </Button>
              </div>
            </div>

            {/* AI Suggestion */}
            {aiSuggestion && (
              <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Bot className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-purple-900 mb-1">AI Suggestion</p>
                    <p className="text-sm text-purple-800">{aiSuggestion}</p>
                    <div className="flex space-x-2 mt-3">
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline"
                        onClick={() => setAiSuggestion(null)}
                        className="border-purple-300 text-purple-700 hover:bg-purple-100"
                      >
                        Dismiss
                      </Button>
                      <Button 
                        type="button" 
                        size="sm"
                        onClick={() => {
                          toast.success('Great! Your issue is resolved.');
                          navigate('/');
                        }}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Problem Solved
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-[#01411C] font-semibold">
                Category <span className="text-[#DC3545]">*</span>
              </Label>
              <Select value={category} onValueChange={(value) => setCategory(value as TicketCategory)} required>
                <SelectTrigger className="border-[#01411C]/20 focus:border-[#01411C]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="hover:bg-[#DFF5E1]">
                      <div className="flex items-center justify-between w-full">
                        <span>{cat.label}</span>
                        {cat.requiresLocation && (
                          <Badge variant="outline" className="ml-2 text-xs bg-[#FFC107] text-black border-0">
                            GPS Required
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {requiresLocation && (
                <div className="flex items-start space-x-2 mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-800">
                    This category requires GPS location for proper incident reporting and response.
                  </p>
                </div>
              )}
            </div>

            {/* GPS Location (conditional) */}
            {requiresLocation && (
              <div className="space-y-2">
                <Label className="text-[#01411C] font-semibold">
                  GPS Location <span className="text-[#DC3545]">*</span>
                </Label>
                <div className="border-2 border-dashed border-[#01411C]/30 rounded-lg p-4 bg-[#DFF5E1]/30">
                  {location ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-[#01411C]">
                          <CheckCircle className="w-5 h-5 text-[#28A745]" />
                          <span className="font-semibold">Location Captured</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setLocation(null)}
                          className="text-[#DC3545] hover:bg-[#DC3545]/10"
                        >
                          Clear
                        </Button>
                      </div>
                      <div className="bg-white p-3 rounded border border-[#01411C]/20">
                        <p className="text-sm text-gray-600 mb-1">Coordinates:</p>
                        <p className="text-sm font-mono text-[#01411C]">{location.address}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Captured: {new Date(location.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <MapPin className="w-8 h-8 text-[#01411C] mx-auto mb-2" />
                      <p className="text-sm text-gray-700 mb-3">
                        Click the button below to capture your current location
                      </p>
                      <Button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={isGettingLocation}
                        className="bg-[#01411C] hover:bg-[#0B5D1E]"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        {isGettingLocation ? 'Getting Location...' : 'Capture GPS Location'}
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        Please enable location services in your browser
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Attachments */}
            <div className="space-y-2">
              <Label className="text-[#01411C] font-semibold">Attachments (Optional)</Label>
              <div className="border-2 border-dashed border-[#01411C]/30 rounded-lg p-6 text-center hover:border-[#01411C] transition-colors cursor-pointer bg-[#DFF5E1]/20">
                <Upload className="w-8 h-8 text-[#01411C] mx-auto mb-2" />
                <p className="text-sm text-gray-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Images, videos, documents (max 10MB)
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center space-x-3 pt-4 border-t-2 border-[#01411C]/20">
              <Button 
                type="submit" 
                size="lg" 
                className="flex-1 bg-[#01411C] hover:bg-[#0B5D1E] text-white font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/')}
                disabled={isSubmitting}
                className="border-[#01411C]/30 text-[#01411C] hover:bg-[#DFF5E1]"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-bold text-[#01411C] mb-3 flex items-center">
            <Bot className="w-5 h-5 mr-2" />
            What happens next?
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#01411C] text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <span>Your ticket will be analyzed by our AI system for priority classification</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#01411C] text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <span>If it's a common issue, AI might auto-resolve it instantly</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#01411C] text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <span>Otherwise, it will be assigned to the best available agent</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#01411C] text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
              <span>You'll receive real-time updates via notifications</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}