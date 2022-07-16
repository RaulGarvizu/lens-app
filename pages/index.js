import { useState, useEffect } from "react"
import Link from 'next/link'

import Masonry from '@mui/lab/Masonry'
import Card from "@mui/material/Card"
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { Container, Divider, Typography, ListItemText } from "@mui/material"

import { client, recommendProfiles } from '../api'

const style = {
  background: '#0092ff',
  padding: '8px',
};

export default function Home() {

  const [profiles, setProfiles] = useState([])

  useEffect(() => {
    fetchProfiles()
  }, [])

  async function fetchProfiles() {
    try {
      const response = await client.query(recommendProfiles).toPromise()
      console.log({response})
      setProfiles(response.data.recommendedProfiles)
    } catch (error) {
      console.error({ error })
    }
  }

  return (
    <Container sx={{ padding: '20px' }}>
      <Typography variant="h3" component="div" gutterBottom>
        Recommended Profiles
      </Typography>
      <Masonry columns={4} spacing={3}>
        {
          profiles.map((profile, index) => (
            <Link href={`/profile/${profile.id}`} key={index}>
              <Card sx={{width: 250}} raised>
                <CardHeader
                  avatar={<Avatar src={profile.picture?.original?.url} alt={profile.name} />}
                  title={<ListItemText primary={profile.name} secondary={profile.handle} />}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {profile.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          ))
        }
      </Masonry>
    </Container>
  )
}
