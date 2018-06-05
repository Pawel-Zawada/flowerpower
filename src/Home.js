import React, { Component } from 'react';

import firebase from 'firebase';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import Winkel from './winkel.jpg';

const styles = theme => ({
  container: {
    margin: theme.spacing.unit,
    width: '100%'
  },
  card: {
    maxWidth: 400
  },
  media: {
    height: 0,
    paddingTop: '60%'
  }
});

class Home extends Component {
  state = { flower: null };
  componentDidMount() {
    firebase
      .database()
      .ref('flowers')
      .orderByValue()
      .limitToLast(1)
      .once('value', snapshot => {
        if (snapshot.val()) {
          Object.keys(snapshot.val()).map(snapIndex => {
            const snap = snapshot.val()[snapIndex];

            this.setState({ flower: snap });
          });
        }
      });
  }
  render() {
    const { classes } = this.props;
    const { flower } = this.state;
    return (
      <Grid container spacing={16} classes={{ container: classes.container }}>
        <Grid item xs={12}>
          <Typography variant={'display2'}>
            Welkom bij bloemenwinkel Flowerpower
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={6}>
              <img style={{ width: '90%' }} src={Winkel} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="title">
                De nummer 1 in bloemen laten bezorgen!
              </Typography>
              <Typography variant="body1">
                Flowerpower is een expert in wereldwijd bloemen laten bezorgen.
                Online bloemen bestellen bij Flowerpower betekent een
                wereldwijde levering op dezelfde dag, al sinds 1982. Een
                bloemetje bezorgen is gemakkelijk en wij garanderen topkwaliteit
                van onder andere rozen, gerbera's, tulpen, lelies en
                seizoensboeketten van al onze 11.000 bloemisten. Wij kunnen jouw
                planten, cadeausets en bloemen internationaal bezorgen. Als jouw
                order op werkdagen voor 14:00 uur en op zaterdagen voor 12:00
                uur binnen is, bezorgen wij nog dezelfde dag, door heel
                Nederland. <br />
                <br />Bloemen bezorgen via Flowerpower staat voor hoogwaardige
                kwaliteit, service en handgebonden boeketten. Flowerpower is
                tevens vertegenwoordigd op verschillende social media kanalen.
                Neem bijvoorbeeld eens een kijkje op onze blog voor alle laatste
                trends, tips, nieuwtjes en meer. Bezoek ons ook eens op
                Facebook!
              </Typography>
              <Divider style={{ margin: 16 }} />
              <Typography variant="title">
                Online bloemen versturen & Flowerpower laat jouw bloemetje
                bezorgen
              </Typography>
              <Typography variant="body1">
                Flowerpower heeft voor ieder seizoen boeketten, voor welke
                gelegenheid dan ook. Wat te denken van verjaardagsboeketten,
                bruidsboeketten, rouwwerk, bloemen voor hem en voor haar.
                Daarnaast hebben we ook een passend aanbod in planten en
                cadeausets. <br />
                <br />Jouw bloemen sturen - daar zorgen wij voor. Bij
                feestelijke gelegenheden zoals Valentijnsdag, Kerst, Pasen,
                Halloween en Moederdag hoort een boeket verse bloemen.
                Flowerpower zorgt ervoor dat de boeketten door de beste
                bloemisten worden geleverd. Met bijna dertig jaar ervaring kun
                je er van uitgaan dat een bloemetje versturen via Flowerpower
                een goed en betrouwbaar idee is. Dus; voor online bloemen
                bestellen én bezorgen ben je bij ons aan het juiste adres!
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justify="center">
            <Grid item>
              <Typography variant={'display1'}>
                Feliciteer iemand met zijn of haar verjaardag met bloemen!
              </Typography>
              <Typography variant={'subheading'}>
                Wereldwijd bezorgd | Meer dan 50 miljoen boeketten verkocht |
                Dezelfde dag bezorgd op werk- en zaterdagen
              </Typography>
              <Grid container justify="center">
                <Grid item style={{ marginTop: 16 }}>
                  {flower && (
                    <Card className={classes.card}>
                      <CardMedia
                        className={classes.media}
                        image={flower.image}
                        title={flower.name}
                      />
                      <CardContent>
                        <Typography
                          gutterBottom
                          variant="headline"
                          component="h2"
                        >
                          {flower.name}
                        </Typography>
                        <Typography component="p">
                          {flower.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          component={Link}
                          to="/products"
                          size="small"
                          color="primary"
                        >
                          Meer
                        </Button>
                      </CardActions>
                    </Card>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Home);
