import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { client, getProfile, getPublications } from "../../api"

import Badge from '@mui/material/Badge'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'

import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Avatar, Container, List, ListItem, ListItemText, Typography } from "@mui/material"

export default function Profile() {
  const [profile, setProfile] = useState({})
  const router = useRouter()
  const { id } = router.query
  const [publications, setPublications] = useState([])

  useEffect(() => {
    if (id) {
      fetchProfile()
      fetchPublications()
    }
  }, [id])

  async function fetchPublications() {
    try {
      const response = await client.query(getPublications, {id}).toPromise()
      console.log({response})
      setPublications(response.data?.publications?.items)
    }
    catch (err) {
      console.error({err})
    }
  }

  async function fetchProfile() {
    try{
      const response = await client.query(getProfile, {
        id
      }).toPromise()
      console.log({response})
      setProfile(response.data.profile)
    }
    catch (err) {
      console.error({err})
    }
  }

  const floatingStyle = {
    margin: 0,
    top: 20,
    right: 'auto',
    bottom: 'auto',
    left: publications.length > 0 ? 360 : 0,
    position: 'fixed',
  }

  return (
    <Stack direction='row'>
      <List title="Publications" sx={{ maxWidth: publications.length > 0 ? 360 : 0, background: 'whitesmoke' }}>
        {
          publications.map((publication, index) => (
            <ListItem key={index} alignItems="flex-start">
              <ListItemText primary={publication.metadata?.name} secondary={publication.metadata?.description}/>
            </ListItem>
          ))
        }
      </List>
      <Container style={floatingStyle} sx={{paddingTop: '20px'}}>
        <Card raised sx={{ maxWidth: 400 }}>
          <CardHeader title={<ListItemText primary={profile.name} secondary={profile.handle}/>}/>
          <CardMedia
            component='img'
            height={profile.picture?.original?.url ? 500 : 0}
            image={profile.picture?.original?.url}
          />
          <CardContent>
            <Typography variant="body2" sx={{paddingBottom: '25px'}} >
              {profile.bio}
            </Typography>
            <Stack direction='row' spacing={4}>
              <Badge badgeContent={profile.stats?.totalFollowers} max={9999} color='primary'>
                <Chip variant="outlined" color="primary" label="Followers"/>
              </Badge>
              <Badge badgeContent={profile.stats?.totalFollowing} max={9999} color='primary'>
                <Chip variant="outlined" color="primary" label="Following"/>
              </Badge>
              <Badge badgeContent={profile.stats?.totalPosts} max={9999} color='primary'>
                <Chip variant="outlined" color="primary" label="Posts"/>
              </Badge>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Stack>
  )
}

