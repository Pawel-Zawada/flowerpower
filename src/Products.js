import React, { Component } from 'react';
import firebase from 'firebase';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  container: {
    margin: theme.spacing.unit,
    width: '100%'
  },
  card: {
    maxWidth: 345
  },
  media: {
    height: 0,
    paddingTop: '56.25%'
  }
});

class Products extends Component {
  state = {};
  componentDidMount() {
    firebase
      .database()
      .ref('flowers')
      .on('value', snapshot => {
        this.setState({ flowers: snapshot.val() });
      });
  }

  handleAdd = flower => {
    this.setState({ items: { ...this.state.items, ...flower } }, () => {
      this.props.handleAdd(this.state.items);
    });
  };

  render() {
    const { classes } = this.props;
    const { flowers } = this.state;

    return (
      <Grid container spacing={8} classes={{ container: classes.container }}>
        {flowers
          ? Object.keys(flowers).map((flowerIndex, index) => {
              const flower = flowers[flowerIndex];
              return (
                <Grid item key={index}>
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
                        onClick={() => {
                          this.handleAdd({ [flowerIndex]: flower });
                        }}
                        size="small"
                        color="primary"
                      >
                        Toevoegen
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })
          : null}
      </Grid>
    );
  }
}

export default withStyles(styles)(Products);
