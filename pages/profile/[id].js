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
import { Button, CardActions, Container, List, ListItem, ListItemText, Typography, Breadcrumbs, Link } from "@mui/material"

import abi from '../../abi.json'
import { ethers } from "ethers"

const address = '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d'

export default function Profile() {
  const [profile, setProfile] = useState({})
  const router = useRouter()
  const { id } = router.query
  const [publications, setPublications] = useState([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProfile()
      fetchPublications()
    }
  }, [id])

  async function connect() {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    })
    console.log({ accounts })
    setConnected(accounts.length > 0)
  }

  async function followUser() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(address, abi, signer)
    try {
      const tx = await contract.follow([id], [0x0])
      await tx.wait()
      console.log('followed user successfully')
    }
    catch (err) {
      console.error(err)
    }
  }

  async function fetchPublications() {
    try {
      const response = await client.query(getPublications, { id }).toPromise()
      console.log({ response })
      setPublications(response.data?.publications?.items)
    }
    catch (err) {
      console.error({ err })
    }
  }

  async function fetchProfile() {
    try {
      const response = await client.query(getProfile, {
        id
      }).toPromise()
      console.log({ response })
      setProfile(response.data.profile)
    }
    catch (err) {
      console.error({ err })
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
    <>
      <Breadcrumbs>
        <Link underline="hover" color="inherit" href="/">Profiles</Link>
        <Typography color='text.primary'>{ profile.handle }</Typography>
      </Breadcrumbs>
      <Button onClick={ connect } disabled={ connected } >Connect</Button>
      <Stack direction='row'>
        <Container style={ floatingStyle } sx={ { paddingTop: '20px' } }>
          <Card raised sx={ { maxWidth: 400 } }>
            <CardHeader title={ <ListItemText primary={ profile.name } secondary={ profile.handle } /> } />
            <CardMedia
              component='img'
              height={ profile.picture?.original?.url ? 500 : 0 }
              image={ profile.picture?.original?.url }
            />
            <CardContent>
              <Typography variant="body2" sx={ { paddingBottom: '25px' } } >
                { profile.bio }
              </Typography>
              <Stack direction='row' spacing={ 4 }>
                <Badge badgeContent={ profile.stats?.totalFollowers } max={ 9999 } color='primary'>
                  <Chip variant="outlined" color="primary" label="Followers" />
                </Badge>
                <Badge badgeContent={ profile.stats?.totalFollowing } max={ 9999 } color='primary'>
                  <Chip variant="outlined" color="primary" label="Following" />
                </Badge>
                <Badge badgeContent={ profile.stats?.totalPosts } max={ 9999 } color='primary'>
                  <Chip variant="outlined" color="primary" label="Posts" />
                </Badge>
              </Stack>
            </CardContent>
            <CardActions>
              <Button variant="contained" onClick={ followUser }>Follow</Button>
            </CardActions>
          </Card>
        </Container>
        <List title="Publications" sx={ { maxWidth: publications.length > 0 ? 360 : 0, background: 'whitesmoke' } }>
          {
            publications.map((publication, index) => (
              <ListItem key={ index } alignItems="flex-start">
                <ListItemText primary={ publication.metadata?.name } secondary={ publication.metadata?.description } />
              </ListItem>
            ))
          }
        </List>
      </Stack>
    </>
  )
}

