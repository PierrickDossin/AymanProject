import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Camera, Upload, X, User } from "lucide-react";

interface ProfilePictureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatarUrl?: string | null;
  onUploadComplete: (url: string) => void;
}

const ProfilePictureDialog = ({
  open,
  onOpenChange,
  currentAvatarUrl,
  onUploadComplete,
}: ProfilePictureDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);

    try {
      // Create unique filename
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_url: publicUrl,
        },
      });

      if (updateError) throw updateError;

      toast({
        title: "Profile picture updated! 📸",
        description: "Your new profile picture has been saved.",
      });

      onUploadComplete(publicUrl);
      onOpenChange(false);
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Failed to upload profile picture.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!user) return;

    setUploading(true);

    try {
      // Update user metadata to remove avatar
      const { error } = await supabase.auth.updateUser({
        data: {
          avatar_url: null,
        },
      });

      if (error) throw error;

      toast({
        title: "Profile picture removed",
        description: "Your profile picture has been removed.",
      });

      onUploadComplete("");
      onOpenChange(false);
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Remove error:", error);
      toast({
        title: "Error",
        description: "Failed to remove profile picture.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-card border-border/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Profile Picture</DialogTitle>
          <DialogDescription>
            Upload a profile picture or remove your current one
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current/Preview Picture */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow overflow-hidden">
                {previewUrl || currentAvatarUrl ? (
                  <img
                    src={previewUrl || currentAvatarUrl || ""}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="text-primary-foreground" size={48} />
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-medium">
                <Camera size={20} className="text-primary-foreground" />
              </div>
            </div>
          </div>

          {/* File Input */}
          <div className="space-y-2">
            <Label htmlFor="picture" className="text-sm font-semibold">
              Choose Image
            </Label>
            <div className="relative">
              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {selectedFile ? (
              <>
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 bg-gradient-primary shadow-glow"
                >
                  <Upload size={18} className="mr-2" />
                  {uploading ? "Uploading..." : "Upload Picture"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  disabled={uploading}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                {currentAvatarUrl && (
                  <Button
                    variant="destructive"
                    onClick={handleRemove}
                    disabled={uploading}
                    className="flex-1"
                  >
                    <X size={18} className="mr-2" />
                    {uploading ? "Removing..." : "Remove Picture"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePictureDialog;
