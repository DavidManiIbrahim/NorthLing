import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from 'lucide-react';
import { apiClient } from "@/lib/api-client";
import { Badge } from './ui/badge';

interface LeaderboardProps {
  targetLanguage?: string;
  currentUserId?: string;
}

interface LeaderboardEntry {
  userId: {
    _id: string;
    username?: string;
    email: string;
  };
  xp: number;
  level: number;
  streak: number;
}

const Leaderboard = ({ targetLanguage, currentUserId }: LeaderboardProps) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await apiClient.getLeaderboard();
        setLeaderboardData(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLeaderboardData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [targetLanguage]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Top Learners
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboardData.map((entry, index) => (
            <div
              key={entry.userId._id}
              className={`flex items-center justify-between p-4 rounded-lg ${entry.userId._id === currentUserId ? 'bg-primary/10' : 'bg-secondary/50'
                }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold min-w-[24px]">#{index + 1}</span>
                <span>{entry.userId.username || entry.userId.email.split('@')[0]}</span>
                {index < 3 && (
                  <Badge variant={index === 0 ? "default" : "secondary"}>
                    {index === 0 ? '🏆' : index === 1 ? '🥈' : '🥉'}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">Level {entry.level}</span>
                <span className="font-semibold">{entry.xp} XP</span>
              </div>
            </div>
          ))}

          {leaderboardData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No learners found yet. Be the first!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;